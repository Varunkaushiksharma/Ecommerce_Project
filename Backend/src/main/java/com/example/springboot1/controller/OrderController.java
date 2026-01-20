package com.example.springboot1.controller;


import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot1.entities.Cart;
import com.example.springboot1.entities.Order;
import com.example.springboot1.repository.CartRepository;
import com.example.springboot1.repository.UserRepository;
import com.example.springboot1.service.CartService;
import com.example.springboot1.service.OrderService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
private final OrderService orderService;
private final CartService cartService;
private final UserRepository userRepository;
private final CartRepository cartRepository;


@PostMapping("/checkout")
public ResponseEntity<?> checkout(@AuthenticationPrincipal UserDetails ud, @RequestBody Map<String, String> body) {
var user = userRepository.findByUsername(ud.getUsername()).orElseThrow();
Cart cart = cartService.getOrCreateCart(user);
String shippingAddress = body.getOrDefault("shippingAddress", "-");
Order order = orderService.createOrderFromCart(user, cart, shippingAddress);
// clear cart
cartService.clearCart(cart);
return ResponseEntity.ok(Map.of("orderId", order.getId(), "total", order.getTotal()));
}
}