package com.example.crud.repository;

import com.example.crud.entities.Request;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {
    List<Request> findByWaitFor(String waitFor);
    List<Request> findByName(String name);
}