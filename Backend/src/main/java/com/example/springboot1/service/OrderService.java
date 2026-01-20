package com.example.springboot1.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.springboot1.entities.Cart;
import com.example.springboot1.entities.CartItem;
import com.example.springboot1.entities.Order;
import com.example.springboot1.entities.OrderItem;
import com.example.springboot1.entities.User;
import com.example.springboot1.repository.OrderRepository;
import com.example.springboot1.repository.ProductRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class OrderService {
private final OrderRepository orderRepository;
private final ProductRepository productRepository;

@Transactional
public Order createOrderFromCart(User user, Cart cart, String shippingAddress) {
if(cart.getItems() == null || cart.getItems().isEmpty()) {
    throw new RuntimeException("Cart is empty, cannot create order");
}
Order o = new Order();
o.setUser(user);
o.setStatus("CREATED");
o.setShippingAddress(shippingAddress);
double total = 0.0;
for (CartItem ci : cart.getItems()) {
OrderItem oi = new OrderItem();
oi.setProduct(ci.getProduct());
oi.setQty(ci.getQty());
double price = productRepository.findById(ci.getProduct().getId())
                 .orElseThrow(() -> new RuntimeException("Product not found"))
                 .getPrice();
oi.setPrice(price);
oi.setOrder(o);
o.getItems().add(oi);
total += ci.getQty() * price;
}
o.setTotal(total);
return orderRepository.save(o);
}


public List<Order> listAll() { return orderRepository.findAll(); }
}