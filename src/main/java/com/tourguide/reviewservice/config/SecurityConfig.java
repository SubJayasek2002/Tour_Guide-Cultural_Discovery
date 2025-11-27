package com.tourguide.reviewservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder(); // password encryption
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public auth endpoints
                .requestMatchers("/auth/**").permitAll()

                // Public: only GET review endpoints
                .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()

                // Authenticated: create / update / delete reviews
                .requestMatchers(HttpMethod.POST, "/api/reviews/**").authenticated()
                .requestMatchers(HttpMethod.PUT,  "/api/reviews/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").authenticated()

                // Everything else authenticated
                .anyRequest().authenticated()
            )
            // For now use HTTP Basic (username/password in Postman)
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }
}
