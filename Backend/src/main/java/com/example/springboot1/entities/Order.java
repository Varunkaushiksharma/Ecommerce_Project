package com.example.springboot1.entities;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.*;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDate;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


@ManyToOne
private User user;


private Double total;


private String status; // CREATED, PAID, SHIPPED, CANCELLED


private LocalDateTime createdAt = LocalDateTime.now();


private String shippingAddress;
private LocalDate shippedDate;
private LocalDate deliveredDate;
private LocalDate estimatedDeliveryDate;


@OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
@JsonManagedReference
private List<OrderItem> items = new ArrayList<>();
}