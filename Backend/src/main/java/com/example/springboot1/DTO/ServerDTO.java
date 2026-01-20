package com.example.springboot1.DTO;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ServerDTO {
    private int id;
    private int userId;
    private List<Integer> memberId;
    private Boolean isPublic;
    private String password;
}
