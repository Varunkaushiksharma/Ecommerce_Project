package com.example.springboot1.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
// import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.springboot1.entities.Try;
import com.example.springboot1.repository.TryRepository;
// import com.example.springboot1.service.TryService;
import com.example.springboot1.repository.OrderRepository;
import com.example.springboot1.entities.Order;
@RestController
// @CrossOrigin(origins = "*")
@RequestMapping("/products")
public class TryController {

    @Autowired
    private TryRepository repo;
    @Autowired
    private OrderRepository orderRepository;

    // @Autowired
    // private TryService service;


    @PostMapping("/add")
    public ResponseEntity<Try> addProduct(
            @RequestParam("name") String name,
            @RequestParam("image") MultipartFile file) throws IOException {
        Try p = new Try();
        p.setName(name);
        p.setFile(file.getBytes());
        return ResponseEntity.ok(repo.save(p));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Try>> getAll() {
        return ResponseEntity.ok(repo.findAll());
    }

    @GetMapping("/image/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable int id) {
        Try p = repo.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(p.getFile());
    }


    // @GetMapping("/allorders")
    // public ResponseEntity<?> getallorders(){
    //     return ResponseEntity.ok(orderRepository.findAll());
    // }


}
