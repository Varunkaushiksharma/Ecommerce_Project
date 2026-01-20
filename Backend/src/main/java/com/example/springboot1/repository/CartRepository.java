package com.example.springboot1.repository;

import com.example.springboot1.entities.Cart;
import com.example.springboot1.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.Optional;


public interface CartRepository extends JpaRepository<Cart, Long> {
Optional<Cart> findByUser(User user);
}