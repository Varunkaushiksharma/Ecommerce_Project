package com.example.springboot1.repository;



import com.example.springboot1.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.springboot1.entities.User;

import java.util.List;


public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);
}
