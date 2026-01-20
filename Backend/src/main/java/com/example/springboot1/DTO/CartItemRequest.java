package com.example.springboot1.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartItemRequest {
    private Long productId;
    private int qty; // default 1
}
