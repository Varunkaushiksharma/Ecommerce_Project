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


    public String generateToken(String email,String type) {

        long expiration;
        switch(type){
            case "PASSWORD_RESET":
                expiration = 1000 * 60 * 15; // 15 mins
            break;

            case "EMAIL_VERIFICATION":
                expiration = 1000 * 60 * 60;
            break;

            case "AUTH":
                expiration = userExpiration;
            break;

            case "ADMIN_AUTH":
                expiration = adminExpiration;
            break;
            default:
                throw new IllegalArgumentException("Invalid token type");
        }

        Date now = new Date();
        Date exp = new Date(now.getTime() + expiration);
        return Jwts.builder()
        .setSubject(email)
        .claim("type", type)
        .setIssuedAt(now)
        .setExpiration(exp)
        .signWith(key)
        .compact();
    }


    public String getEmailFromJwt(String token) {
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
    public String getTokenType(String token) {
    Claims claims = Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();

        return claims.get("type", String.class);
    }
    
}

