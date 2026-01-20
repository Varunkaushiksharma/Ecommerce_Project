package com.example.springboot1.repository;

import com.example.springboot1.entities.Product;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findById(Long id);
}