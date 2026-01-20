package com.example.springboot1.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.springboot1.entities.Try;
// import java.util.List;


@Repository
public interface TryRepository  extends JpaRepository<Try,Integer>{

    // Custom query methods can be defined here
    Try findByName(String name);
}
