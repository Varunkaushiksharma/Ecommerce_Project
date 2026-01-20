package com.example.springboot1.controller;


import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import com.example.springboot1.entities.Category;

import com.example.springboot1.entities.Product;
import com.example.springboot1.repository.CategoryRepository;
import com.example.springboot1.repository.ProductRepository;
import com.example.springboot1.service.ProductService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {
private final ProductService productService;
private final CategoryRepository categoryRepository;


@PostMapping("/products")
public ResponseEntity<?> createProduct(
        @RequestParam String title,
        @RequestParam String description,
        @RequestParam Double price,
        @RequestParam Integer stock,
        @RequestParam Long categoryId,
        @RequestPart("file") MultipartFile file) {

    // Ensure uploads directory exists
    String uploadDir =System.getProperty("user.dir") + "/uploads/";
    File dir = new File(uploadDir);
    if (!dir.exists()) dir.mkdirs();

    // Save file
    String originalFilename = file.getOriginalFilename();
    String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
    String uniqueFileName = UUID.randomUUID().toString() + extension;
    String filePath = uploadDir + uniqueFileName;
    try {
        file.transferTo(new File(filePath));
    } catch (IOException e) {
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                             .body(Map.of("error", "Error saving file"));
    }

    // Create product
    Product p = new Product();
    p.setTitle(title);
    p.setDescription(description);
    p.setPrice(price);
    p.setStock(stock);

    // Set category with only id (assuming category exists)
   Category cat = categoryRepository.findById(categoryId)
                  .orElseThrow(() -> new RuntimeException("Category not found"));
   p.setCategory(cat);
   p.setImageUrl("/uploads/" + uniqueFileName);
   var saved = productService.save(p);

    return ResponseEntity.ok(saved);
}


      @PutMapping("/products/{id}")
public ResponseEntity<?> updateProduct(
    @PathVariable Long id,
    @RequestParam(required = false) String title,
    @RequestParam(required = false) String description,
    @RequestParam(required = false) Double price,
    @RequestParam(required = false) Integer stock,
    @RequestParam(required = false) Long categoryId,
    @RequestPart(value = "file", required = false) MultipartFile file) {

    Product existing = productService.findById(id)
        .orElseThrow(() -> new RuntimeException("Product not found"));
    
    if (title != null) existing.setTitle(title);
    if (description != null) existing.setDescription(description);
    if (price != null) existing.setPrice(price);
    if (stock != null) existing.setStock(stock);

    if (categoryId != null) {
        Category cat = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        existing.setCategory(cat);
    }

    if (file != null && !file.isEmpty()) {
        // Save file like in createProduct
        String uniqueFileName = UUID.randomUUID() + file.getOriginalFilename()
            .substring(file.getOriginalFilename().lastIndexOf("."));
        String filePath = System.getProperty("user.dir") + "/uploads/" + uniqueFileName;
        try { file.transferTo(new File(filePath)); } catch (IOException e) { throw new RuntimeException(e); }
        existing.setImageUrl("/uploads/" + uniqueFileName);
    }

    return ResponseEntity.ok(productService.save(existing));
}


@DeleteMapping("/products/{id}")
public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
productService.delete(id);
return ResponseEntity.ok(Map.of("deleted", true));
}
}