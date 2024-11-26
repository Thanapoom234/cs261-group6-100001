package com.example.crud.service;

import com.example.crud.dto.RequestDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public interface RequestService {
    RequestDTO saveRequest(RequestDTO accountDTO);
    List<RequestDTO> getAllRequests();
    List<RequestDTO> getRequestsByWaitFor(String name);
    RequestDTO getRequestById(Long id);
    RequestDTO updateRequest(Long id, RequestDTO requestDTO);
    void deleteRequest(Long id);
    RequestDTO saveRequestWithFile(RequestDTO requestDTO, MultipartFile file) throws IOException;
    RequestDTO updateRequestWithFile(Long id, RequestDTO requestDTO, MultipartFile file) throws IOException;

    List<RequestDTO> getRequestsByName(String name);
}
