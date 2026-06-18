package com.example.springboot1.security;

import com.example.springboot1.service.AdminService;
import com.example.springboot1.service.UserService;
// import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;


import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {


private final JwtUtils jwtUtils;
private  UserService userService;
private AdminService adminService;

    public JwtAuthFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @Autowired
    public void setAdminService(AdminService adminService) {
        this.adminService = adminService;
    }

    @Override
protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
) throws ServletException, IOException {
    
    final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
    String jwt = null;

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        jwt = authHeader.substring(7);
    }

    if (jwt == null || !jwtUtils.validateJwt(jwt)) {
        filterChain.doFilter(request, response);
        return;
    }

    String type = jwtUtils.getTokenType(jwt);
    String email = jwtUtils.getEmailFromJwt(jwt);

    if (email == null) {
        filterChain.doFilter(request, response);
        return;
    }

    UserDetails userDetails;

    if (type.equals("AUTH")) {
        userDetails = userService.loadUserByUsername(email);

    } else if (type.equals("ADMIN_AUTH")) {
        userDetails = adminService.loadUserByUsername(email);

    } else {
        filterChain.doFilter(request, response);
        return;
    }

    UsernamePasswordAuthenticationToken authToken =
            new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );

    authToken.setDetails(
            new WebAuthenticationDetailsSource().buildDetails(request)
    );

    SecurityContextHolder.getContext().setAuthentication(authToken);
    System.out.println("AUTH HEADER = " + authHeader);
    System.out.println("JWT = " + jwt);
    System.out.println("TYPE = " + type);
    System.out.println("EMAIL = " + email);
    filterChain.doFilter(request, response);
}
}