package com.example.crud.service;

import com.example.crud.dto.RequestDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RequestService {
    RequestDTO saveRequest(RequestDTO accountDTO);
    List<RequestDTO> getAllRequests();
    RequestDTO getRequestById(Long id);
    RequestDTO updateRequest(Long id, RequestDTO requestDTO);
    void deleteRequest(Long id);
}
