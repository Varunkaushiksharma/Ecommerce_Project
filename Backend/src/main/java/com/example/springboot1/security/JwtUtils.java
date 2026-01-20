package com.example.springboot1.security;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


import java.security.Key;
import java.util.Date;


@Component
public class JwtUtils {


    @Value("${jwt.secret}")
    private String jwtSecret;


    // @Value("${jwt.expiration-ms}")
    // private long jwtExpirationMs;

    @Value("${jwt.user.expiration-ms}")
    private long userExpiration;

    @Value("${jwt.admin.expiration-ms}")
    private long adminExpiration;


    private Key key;


    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }


    public String generateToken(String username,boolean isAdmin) {

        long jwtExpirationMs = isAdmin ? adminExpiration : userExpiration;
        Date now = new Date();
        Date exp = new Date(now.getTime() + jwtExpirationMs);
        return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(now)
        .setExpiration(exp)
        .signWith(key)
        .compact();
    }


    public String getUsernameFromJwt(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
        .parseClaimsJws(token).getBody().getSubject();
    }


    public boolean validateJwt(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }
    
}

