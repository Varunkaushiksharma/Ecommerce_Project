package com.example.springboot1.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.springboot1.entities.Try;
import com.example.springboot1.repository.TryRepository;

@Service
public class TryService {

    @Autowired
    private TryRepository tryRepository;

    public Try getTryByName(String name) {
        return tryRepository.findByName(name);
    }

    public ResponseEntity<Try> createTry(String name, String description , MultipartFile file) throws Exception{
        Try entity = new Try();
        entity.setName(name);
        entity.setFile(file.getBytes());
        return ResponseEntity.ok(tryRepository.save(entity));
    }

    public Try addProduct(Try entity, MultipartFile file) throws Exception {
        entity.setFile(file.getBytes());
       return tryRepository.save(entity);
    }


}
