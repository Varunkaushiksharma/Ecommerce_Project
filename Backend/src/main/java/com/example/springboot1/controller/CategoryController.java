package com.example.springboot1.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.springboot1.entities.Category;
import com.example.springboot1.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping("/api/categories")
    public List<CategoryDTO> getCategories() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDTO(c.getName(), c.getSlug()))
                .collect(Collectors.toList());
    }

    // DTO to avoid sending unnecessary fields
    record CategoryDTO(String name, String slug) {}
}
