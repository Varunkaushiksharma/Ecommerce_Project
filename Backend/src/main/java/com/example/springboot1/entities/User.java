package com.example.springboot1.entities;


import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.*;


import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


@Column(unique = true)
private String username;


@Column(unique = true)
private String email;

@JsonIgnore
private String password;


private LocalDateTime createdAt = LocalDateTime.now();


@ManyToMany(fetch = FetchType.EAGER)
@JoinTable(name = "user_roles",
joinColumns = @JoinColumn(name = "user_id"),
inverseJoinColumns = @JoinColumn(name = "role_id"))
private Set<Role> roles = new HashSet<>();
}