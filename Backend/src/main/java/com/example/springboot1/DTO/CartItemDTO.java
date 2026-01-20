package com.example.springboot1.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
public class CartItemDTO {
    private Long id;
    private String productName;
    private double price;
    private int qty;
    private String imageUrl;
    private Long productId;
}