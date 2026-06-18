package com.example.springboot1.service;
import java.util.List;
import java.util.Optional;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;

import com.example.springboot1.entities.Product;
import com.example.springboot1.repository.ProductRepository;

import lombok.RequiredArgsConstructor;


@Service
@RequiredArgsConstructor
public class ProductService {
private final ProductRepository productRepository;

    @Cacheable(value = "products")
    public List<Product> listAll(){ 
        return productRepository.findAll(); 
    }
    
    @Cacheable(value = "product", key = "#id")
    public Optional<Product> get(Long id){
         return productRepository.findById(id); 
    }

    @Caching(evict ={
        @CacheEvict(value = "products", allEntries = true),
        @CacheEvict(value = "product", key = "#p.id")
    })
    public Product save(Product p){
         return productRepository.save(p); 
    }

    @Caching(evict ={
        @CacheEvict(value = "products", allEntries = true),
        @CacheEvict(value = "product", key = "#id")
    })
    public void delete(Long id){
         productRepository.deleteById(id);
    }


}