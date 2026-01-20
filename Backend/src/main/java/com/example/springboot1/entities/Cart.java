package com.example.springboot1.entities;

import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "carts")
public class Cart {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


@OneToOne
private User user;


private LocalDateTime updatedAt = LocalDateTime.now();


@OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
@JsonManagedReference 
private List<CartItem> items = new ArrayList<>();
}