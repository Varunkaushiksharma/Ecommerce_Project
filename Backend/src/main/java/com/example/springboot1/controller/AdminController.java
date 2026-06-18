package com.example.springboot1.controller;

import java.io.File;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.multipart.MultipartFile;

import com.example.springboot1.entities.Category;
import com.example.springboot1.entities.Product;
import com.example.springboot1.repository.CategoryRepository;
import com.example.springboot1.service.ProductService;
import com.example.springboot1.DTO.AdminCreateDTO;
import com.example.springboot1.DTO.AdminLoginRequest;
import com.example.springboot1.entities.Admin;
import com.example.springboot1.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.springboot1.security.JwtUtils;
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductService productService;
    private final CategoryRepository categoryRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam Integer stock,
            @RequestParam Long categoryId,
            @RequestPart("file") MultipartFile file) {

        try {

            // Create uploads folder if not exists
            String uploadDir = System.getProperty("user.dir") + "/uploads/";

            File dir = new File(uploadDir);

            if (!dir.exists()) {
                dir.mkdirs();
            }

            // Safe filename handling
            String originalFilename = file.getOriginalFilename();

            String extension = "";

            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(
                        originalFilename.lastIndexOf(".")
                );
            }

            String uniqueFileName =
                    UUID.randomUUID() + extension;

            String filePath = uploadDir + uniqueFileName;

            file.transferTo(new File(filePath));

            // Find category
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() ->
                            new RuntimeException("Category not found"));

            // Create product
            Product product = new Product();

            product.setTitle(title);
            product.setDescription(description);
            product.setPrice(price);
            product.setStock(stock);

            product.setCategory(category);

            product.setImageUrl("/uploads/" + uniqueFileName);

            Product saved = productService.save(product);

            return ResponseEntity.ok(saved);

        } catch (IOException e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "error",
                            "Error uploading file"
                    ));
        }
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Double price,
            @RequestParam(required = false) Integer stock,
            @RequestParam(required = false) Long categoryId,
            @RequestPart(value = "file", required = false)
            MultipartFile file) {

        Product product = productService.get(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found"));

        if (title != null) {
            product.setTitle(title);
        }

        if (description != null) {
            product.setDescription(description);
        }

        if (price != null) {
            product.setPrice(price);
        }

        if (stock != null) {
            product.setStock(stock);
        }

        if (categoryId != null) {

            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() ->
                            new RuntimeException("Category not found"));

            product.setCategory(category);
        }

        // Update image if provided
        if (file != null && !file.isEmpty()) {

            try {

                String uploadDir =
                        System.getProperty("user.dir") + "/uploads/";

                String originalFilename = file.getOriginalFilename();

                String extension = "";

                if (originalFilename != null &&
                        originalFilename.contains(".")) {

                    extension = originalFilename.substring(
                            originalFilename.lastIndexOf(".")
                    );
                }

                String uniqueFileName =
                        UUID.randomUUID() + extension;

                String filePath = uploadDir + uniqueFileName;

                file.transferTo(new File(filePath));

                product.setImageUrl("/uploads/" + uniqueFileName);

            } catch (IOException e) {

                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of(
                                "error",
                                "Error uploading image"
                        ));
            }
        }

        Product updated = productService.save(product);

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id) {

        productService.delete(id);

        return ResponseEntity.ok(
                Map.of("deleted", true)
        );
    }
    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(
        @RequestHeader("X-SECRET-KEY") String secret,
        @RequestBody AdminCreateDTO body) {
    if (!secret.equals("my-super-secret-key")) {
        return ResponseEntity.status(403)
                .body(Map.of("error", "Forbidden"));
    }

    if (adminRepository.findByEmail(body.getEmail()).isPresent()) {
        return ResponseEntity.badRequest()
                .body(Map.of("error", "Admin already exists"));
    }
    Admin admin = new Admin();

    admin.setUsername(body.getUsername());

    admin.setEmail(body.getEmail());

    admin.setPassword(
            passwordEncoder.encode(body.getPassword())
    );

    adminRepository.save(admin);

    return ResponseEntity.ok(
            Map.of("msg", "Admin created")
    );
}
    @PostMapping("/login")
public ResponseEntity<?> adminLogin(@RequestBody AdminLoginRequest body) {

    Admin admin = adminRepository.findByEmail(body.getEmail())
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

    if (!passwordEncoder.matches(body.getPassword(), admin.getPassword())) {
        return ResponseEntity.status(401)
                .body(Map.of("error", "Invalid credentials"));
    }

    String token = jwtUtils.generateToken(admin.getEmail(), "ADMIN_AUTH");

    return ResponseEntity.ok(Map.of(
            "token", token,
            "email", admin.getEmail()
    ));
}
}