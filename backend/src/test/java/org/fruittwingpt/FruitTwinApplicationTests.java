package org.fruittwingpt;
import org.junit.jupiter.api.Test; import org.springframework.beans.factory.annotation.Autowired; import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc; import org.springframework.boot.test.context.SpringBootTest; import org.springframework.http.MediaType; import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post; import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
@SpringBootTest @AutoConfigureMockMvc class FruitTwinApplicationTests {
 @Autowired MockMvc mvc;
 @Test void contextLoads(){}
 @Test void registrationReturnsHs256AccessToken() throws Exception { mvc.perform(post("/api/auth/register").contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"auth-test@example.com\",\"fullName\":\"Auth Test\",\"workspaceName\":\"Test Workspace\",\"password\":\"test-password-2026\"}")).andExpect(status().isCreated()).andExpect(jsonPath("$.accessToken").isNotEmpty()).andExpect(jsonPath("$.tokenType").value("Bearer")); }
}
