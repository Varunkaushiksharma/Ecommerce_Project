package com.example.springboot1.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.example.springboot1.DTO.CartDTO;
import com.example.springboot1.DTO.CartItemDTO;
import com.example.springboot1.DTO.CartItemRequest;
import com.example.springboot1.entities.Cart;
import com.example.springboot1.repository.UserRepository;
import com.example.springboot1.service.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;
    private final UserRepository userRepository;

    // helper to convert entity -> DTO
    private CartDTO toDTO(Cart cart) {
    List<CartItemDTO> items = cart.getItems().stream()
            .map(i -> new CartItemDTO(
                    i.getId(),
                    i.getProduct().getTitle(), // productName
                    i.getPrice(),
                    i.getQty(),
                    i.getProduct().getImageUrl(),
                    i.getProduct().getId() // productId
            ))
            .toList();

    double total = items.stream()
            .mapToDouble(ci -> ci.getPrice() * ci.getQty())
            .sum();

    return new CartDTO(cart.getId(), items, total);
}


    // ✅ Add to cart
    @PostMapping("/add")
    public ResponseEntity<?> add(@AuthenticationPrincipal UserDetails ud,
                                 @RequestBody CartItemRequest request) {
        var user = userRepository.findByEmail(ud.getUsername()).orElseThrow();
        Cart cart = cartService.addToCart(user, request.getProductId(), request.getQty());
        return ResponseEntity.ok(toDTO(cart));
    }

    // ✅ Get cart
    @GetMapping
    public ResponseEntity<?> get(@AuthenticationPrincipal UserDetails ud) {
        var user = userRepository.findByEmail(ud.getUsername()).orElseThrow();
        Cart cart = cartService.getOrCreateCart(user);
        return ResponseEntity.ok(toDTO(cart));
    }

    // ✅ Remove from cart
    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<?> remove(@AuthenticationPrincipal UserDetails ud,
                                    @PathVariable Long itemId) {
        var user = userRepository.findByEmail(ud.getUsername()).orElseThrow();
        Cart cart = cartService.removeFromCart(user, itemId);
        return ResponseEntity.ok(toDTO(cart));
    }
}
