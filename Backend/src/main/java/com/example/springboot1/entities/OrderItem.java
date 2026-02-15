package com.example.springboot1.entities;


import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "order_items")
public class OrderItem {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;


@ManyToOne
private Product product;


private Integer qty;


private Double price;


@ManyToOne
@JoinColumn(name = "order_id")
@JsonBackReference
private Order order;
}

