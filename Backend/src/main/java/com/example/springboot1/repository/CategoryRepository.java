package com.example.springboot1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.springboot1.entities.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
}
