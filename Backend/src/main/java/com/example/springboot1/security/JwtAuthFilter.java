package com.example.springboot1.security;

import com.example.springboot1.service.UserService;
// import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;


@Component
public class JwtAuthFilter extends OncePerRequestFilter {


private final JwtUtils jwtUtils;
private  UserService userService;

    public JwtAuthFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

@Override
protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
String jwt = null;
if (authHeader != null && authHeader.startsWith("Bearer ")) {
jwt = authHeader.substring(7);
}


if (jwt != null && jwtUtils.validateJwt(jwt)) {
String username = jwtUtils.getUsernameFromJwt(jwt);
var userDetails = userService.loadUserByUsername(username);
UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
userDetails, null, userDetails.getAuthorities());
authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
SecurityContextHolder.getContext().setAuthentication(authToken);
}


filterChain.doFilter(request, response);
}
}