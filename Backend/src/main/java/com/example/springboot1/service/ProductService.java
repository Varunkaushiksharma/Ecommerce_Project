package com.example.springboot1.service;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import com.example.springboot1.entities.Product;
import com.example.springboot1.repository.ProductRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ProductService {
private final ProductRepository productRepository;


public List<Product> listAll() { return productRepository.findAll(); }
public Optional<Product> get(Long id) { return productRepository.findById(id); }
public Product save(Product p) { return productRepository.save(p); }
public void delete(Long id) { productRepository.deleteById(id); }
public Optional<Product> findById(Long id) {
    return productRepository.findById(id);
}

}