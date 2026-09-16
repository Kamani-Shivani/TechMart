package com.example.projectUsingSpring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{

        http.csrf(csrf-> csrf.disable());
        http.cors(cors->{});
        http.headers(headers->headers.frameOptions(frame-> frame.sameOrigin()));
        http.authorizeHttpRequests(auth->auth
                .requestMatchers("/h2-console/**").permitAll()

                //Product images can be loaded by <img>
                .requestMatchers(HttpMethod.GET, "/api/product/*/image").permitAll()

                //Everything else requires login
                .anyRequest().authenticated());

        http.httpBasic(httpBasic->{});

        return http.build();
    }
}
