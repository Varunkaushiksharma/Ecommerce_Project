package com.example.springboot1.controller;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot1.entities.Product;
import com.example.springboot1.service.ProductService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
private final ProductService productService;


@GetMapping
public ResponseEntity<List<Product>> list() { return ResponseEntity.ok(productService.listAll()); }


@GetMapping("/{id}")
public ResponseEntity<?> get(@PathVariable Long id) {
return productService.get(id).map(ResponseEntity::ok).orElseGet(()->ResponseEntity.notFound().build());
}
}