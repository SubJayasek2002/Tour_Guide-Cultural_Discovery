package com.tourguide.tourguide_backend.repository;

import com.tourguide.tourguide_backend.entity.userEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface userRepo extends JpaRepository<userEntity, Integer> {
}
