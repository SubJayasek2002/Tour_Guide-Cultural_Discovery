package com.tourguide.tourguide_backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class DtoUser {
    private  int id;
    private String name;
    private  String address;
}
