package com.example.springboot1.controller;


import java.util.Map;
import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import com.example.springboot1.repository.OrderRepository;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;

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
private final OrderRepository orderRepository;

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal UserDetails ud) {
        if(ud == null) {
            return ResponseEntity.status(403).body("forbiden");
        }
        var user = userRepository.findByEmail(ud.getUsername()).orElseThrow();
        var orders = orderService.getOrdersForUser(user);
        return ResponseEntity.ok(orders);
    } 

    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@AuthenticationPrincipal UserDetails ud, @RequestBody Map<String, String> body) {
        var user = userRepository.findByEmail(ud.getUsername()).orElseThrow();
        Cart cart = cartService.getOrCreateCart(user);
        String shippingAddress = body.getOrDefault("shippingAddress", "-");
        Order order = orderService.createOrderFromCart(user, cart, shippingAddress);
        // clear cart
        cartService.clearCart(cart);
        return ResponseEntity.ok(Map.of("orderId", order.getId(), "total", order.getTotal()));
    }

    @GetMapping("/all-order")
    public ResponseEntity<?> getAllOrders(@AuthenticationPrincipal UserDetails ud) {
        if(ud == null || !ud.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(403).body("forbiden");
        }
        var orders = orderService.listAll();
        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
        Order order = orderService.getOrderById(orderId);

        if (!order.getStatus().equals("CREATED")) {
            return ResponseEntity.badRequest().body("Order cannot be cancelled");
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);

        return ResponseEntity.ok("Order cancelled successfully");
    }
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long orderId,
            Authentication authentication) {

        Order order = orderService.getOrderById(orderId);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        String username = authentication.getName();

        // Allow only owner or admin
        boolean isOwner = order.getUser().getEmail().equals(username);
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(order);
    }
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> body,
            Authentication authentication) {

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Order order = orderService.getOrderById(orderId);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        String newStatus = body.get("status");

        switch (newStatus) {
            case "PROCESSING":
                order.setStatus("PROCESSING");
                break;

            case "SHIPPED":
                order.setStatus("SHIPPED");
                order.setShippedDate(LocalDate.now());
                order.setEstimatedDeliveryDate(LocalDate.now().plusDays(5));
                break;

            case "DELIVERED":
                order.setStatus("DELIVERED");
                order.setDeliveredDate(LocalDate.now());
                break;

            default:
                return ResponseEntity.badRequest().body("Invalid status");
        }

        orderRepository.save(order);
        return ResponseEntity.ok(order);
    }
    @GetMapping("/stats")
    public ResponseEntity<?> getOrderStats(Authentication authentication) {

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        System.out.println("Authorities: " + authentication.getAuthorities());
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        var orders = orderService.listAll();

        long totalOrders = orders.size();

        double totalRevenue = orders.stream()
                .filter(o -> !o.getStatus().equals("CANCELLED"))
                .mapToDouble(Order::getTotal)
                .sum();

        long cancelledOrders = orders.stream()
                .filter(o -> o.getStatus().equals("CANCELLED"))
                .count();

        long deliveredOrders = orders.stream()
                .filter(o -> o.getStatus().equals("DELIVERED"))
                .count();

        return ResponseEntity.ok(Map.of(
                "totalOrders", totalOrders,
                "totalRevenue", totalRevenue,
                "cancelledOrders", cancelledOrders,
                "deliveredOrders", deliveredOrders
        ));
    }
}