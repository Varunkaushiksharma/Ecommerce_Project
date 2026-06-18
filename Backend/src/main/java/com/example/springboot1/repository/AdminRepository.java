package com.example.springboot1.repository;

import org.springframework.stereotype.Repository;
import com.example.springboot1.entities.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin,Long> {

    Optional<Admin> findByEmail(String email);
}
