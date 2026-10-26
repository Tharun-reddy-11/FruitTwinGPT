package org.fruittwingpt.api;

import jakarta.validation.constraints.*;
import org.fruittwingpt.config.TokenService;
import org.fruittwingpt.domain.AppUser;
import org.fruittwingpt.repo.UserRepository;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder passwords;
    private final TokenService tokens;

    public AuthController(UserRepository users, PasswordEncoder passwords, TokenService tokens) {
        this.users = users;
        this.passwords = passwords;
        this.tokens = tokens;
    }

    public record Credentials(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 6, max = 128, message = "Password must contain at least 6 characters") String password
    ) {}

    public record RegisterRequest(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 2, max = 120, message = "Enter your full name") String fullName,
        String workspaceName,
        @NotBlank @Size(min = 6, max = 128, message = "Password must contain at least 6 characters") String password
    ) {}

    public record ProfileUpdateRequest(
        @NotBlank @Size(min = 2, max = 120) String fullName,
        String workspaceName,
        String avatarUrl
    ) {}

    public record Session(
        String accessToken,
        String token,
        String tokenType,
        long expiresInSeconds,
        String email,
        String fullName,
        String workspaceName,
        String avatarUrl
    ) {}

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public Session register(@RequestBody @jakarta.validation.Valid RegisterRequest in) {
        var email = in.email().trim().toLowerCase(Locale.ROOT);
        if (users.findByEmail(email).isPresent()) {
            throw ApiException.conflict("An account with that email already exists. Please sign in instead.");
        }
        var u = new AppUser();
        u.email = email;
        u.fullName = in.fullName().trim();
        var ws = (in.workspaceName() != null && !in.workspaceName().trim().isEmpty())
            ? in.workspaceName().trim()
            : in.fullName().trim() + "'s Orchard Workspace";
        u.workspaceName = ws;
        u.passwordHash = passwords.encode(in.password());
        users.save(u);
        return session(u);
    }

    @PostMapping("/login")
    public Session login(@RequestBody @jakarta.validation.Valid Credentials in) {
        var u = users.findByEmail(in.email().trim().toLowerCase(Locale.ROOT))
            .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));
        if (!passwords.matches(in.password(), u.passwordHash)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        return session(u);
    }

    @PutMapping("/profile")
    public Session updateProfile(@AuthenticationPrincipal Jwt jwt, @RequestBody @jakarta.validation.Valid ProfileUpdateRequest in) {
        var u = users.findByEmail(jwt.getSubject())
            .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        u.fullName = in.fullName().trim();
        if (in.workspaceName() != null && !in.workspaceName().trim().isEmpty()) {
            u.workspaceName = in.workspaceName().trim();
        }
        if (in.avatarUrl() != null) {
            u.avatarUrl = in.avatarUrl();
        }
        users.save(u);
        return session(u);
    }

    private Session session(AppUser u) {
        String tokenStr = tokens.create(u);
        return new Session(tokenStr, tokenStr, "Bearer", 3600, u.email, u.fullName, u.workspaceName, u.avatarUrl);
    }
}
