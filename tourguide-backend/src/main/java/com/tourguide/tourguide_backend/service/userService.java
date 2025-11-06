package com.tourguide.tourguide_backend.service;

import com.tourguide.tourguide_backend.DTO.DtoUser;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
@Transactional
public class userService {
    @Autowired
    private userRepo userRepo;
    public String saveUser(DtoUser DtoUser){
        userRepo.save(DtoUser);
    }

}
