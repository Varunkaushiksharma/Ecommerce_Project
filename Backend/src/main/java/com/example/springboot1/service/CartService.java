package com.example.springboot1.service;

import org.springframework.stereotype.Service;

import com.example.springboot1.entities.Cart;
import com.example.springboot1.entities.CartItem;
import com.example.springboot1.entities.Product;
import com.example.springboot1.entities.User;
import com.example.springboot1.repository.CartRepository;
import com.example.springboot1.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user).orElseGet(() -> {
            Cart c = new Cart();
            c.setUser(user);
            return cartRepository.save(c);
        });
    }

    public Cart addToCart(User user, Long productId, int qty) {
        Cart cart = getOrCreateCart(user);
        Product p = productRepository.findById(productId).orElseThrow();

        // Check if product already exists
        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(p.getId()))
                .findFirst()
                .orElse(null);

        if (item != null) {
            item.setQty(item.getQty() + qty);
        } else {
            CartItem ci = new CartItem();
            ci.setProduct(p);
            ci.setQty(qty);
            ci.setPrice(p.getPrice());
            ci.setCart(cart);
            cart.getItems().add(ci);
        }

        cart.setUpdatedAt(java.time.LocalDateTime.now());
        return cartRepository.save(cart);
    }

    public Cart clearCart(Cart cart) {
        cart.getItems().clear();
        cart.setUpdatedAt(java.time.LocalDateTime.now());
        return cartRepository.save(cart);
    }

    public Cart removeFromCart(User user, Long itemId) {
        Cart cart = getOrCreateCart(user);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        cart.setUpdatedAt(java.time.LocalDateTime.now());
        return cartRepository.save(cart);
    }
}
