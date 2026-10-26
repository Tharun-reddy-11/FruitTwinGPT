package org.fruittwingpt.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class AppUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, unique = true)
    public String email;

    @Column(name = "full_name")
    public String fullName;

    @Column(name = "workspace_name")
    public String workspaceName;

    @Column(name = "avatar_url", columnDefinition = "LONGTEXT")
    public String avatarUrl;

    @Column(name = "password_hash", nullable = false)
    public String passwordHash;

    @Column(nullable = false)
    public String role = "USER";

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt = Instant.now();
}
