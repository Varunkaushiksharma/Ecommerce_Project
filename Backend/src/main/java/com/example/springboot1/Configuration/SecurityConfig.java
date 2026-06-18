package com.example.springboot1.Configuration;

import com.example.springboot1.security.JwtAuthFilter;
import com.example.springboot1.security.JwtUtils;
import com.example.springboot1.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.example.springboot1.service.AdminService;
@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtUtils jwtUtils;

    public SecurityConfig(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Bean
    public JwtAuthFilter jwtAuthFilter(UserService userService, AdminService adminService) {
        JwtAuthFilter filter = new JwtAuthFilter(jwtUtils);
        filter.setUserService(userService);
        filter.setAdminService(adminService);
        return filter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> {}) // we configure CORS below
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // public endpoints
                .requestMatchers(
                    "/api/auth/**",
                    "/actuator/**",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/api/products/**",
                    // "/api/products",
                    "/api/categories/**",
                    "/uploads/**",
                    "/api/admin/login",
                    "/api/admin/create"
                ).permitAll()
                 .requestMatchers("/api/admin/**").hasRole("ADMIN")
                 .requestMatchers("/api/products/**").hasAnyRole("USER", "ADMIN")
                 .requestMatchers("/api/categories/**").hasAnyRole("USER", "ADMIN")
                 .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000") // explicitly your React frontend
                        .allowedMethods("*")
                        .allowedHeaders("*")
                        .allowCredentials(true); // now valid because origin is explicit
            }
        };
    }
}