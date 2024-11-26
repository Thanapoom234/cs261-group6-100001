package com.example.crud.controller;

import com.example.crud.dto.RequestDTO;
import com.example.crud.exception.ResourceNotFoundException;
import com.example.crud.service.RequestService;
import com.example.crud.entities.Request;
import com.example.crud.repository.RequestRepository;

import java.util.List;
import java.util.Map;


import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.FileNotFoundException;
import java.io.UnsupportedEncodingException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping(value = "/api/requests", produces = "application/json; charset=UTF-8")
@CrossOrigin(origins = "http://localhost:3000")
public class RequestController {

    private final RequestService requestService;
    private final RequestRepository requestRepository;

    @Autowired
    public RequestController(RequestService requestService, RequestRepository requestRepository) {
        this.requestService = requestService;
        this.requestRepository = requestRepository;
    }

    // Save a new request
    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<RequestDTO> createRequest(@RequestParam("request") String requestData,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            RequestDTO requestDTO = new ObjectMapper().readValue(requestData, RequestDTO.class);

            if (file == null || file.isEmpty()) {
                RequestDTO savedRequest = requestService.saveRequest(requestDTO);
                return new ResponseEntity<>(savedRequest, HttpStatus.CREATED);
            }

            RequestDTO savedRequest = requestService.saveRequestWithFile(requestDTO, file);
            return new ResponseEntity<>(savedRequest, HttpStatus.CREATED);
            
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/fetch")
    public ResponseEntity<List<RequestDTO>> fetchRequestsByWaitFor(@RequestBody Map<String, String> requestBody) {
        String name = requestBody.get("name"); // Extract name from the request body
        List<RequestDTO> requests = requestService.getRequestsByWaitFor(name); // Use service to fetch data
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    @PostMapping("/fetch/student")
    public ResponseEntity<List<RequestDTO>> fetchRequestsByName(@RequestBody Map<String, String> requestBody) {
        String name = requestBody.get("name"); // Extract name from the request body
        List<RequestDTO> requests = requestService.getRequestsByName(name); // Use service to fetch data
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    // Get all requests
    @GetMapping
    public ResponseEntity<List<RequestDTO>> getAllRequests() {
        List<RequestDTO> requests = requestService.getAllRequests();
        return new ResponseEntity<>(requests, HttpStatus.OK);
    }

    // Get a request by ID
    @GetMapping("/{id}")
    public ResponseEntity<RequestDTO> getRequestById(@PathVariable Long id) {
        try {
            RequestDTO request = requestService.getRequestById(id);
            return new ResponseEntity<>(request, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) throws FileNotFoundException, UnsupportedEncodingException {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));

        Path filePath = Paths.get(request.getFilePath());
        if (!Files.exists(filePath)) {
            throw new FileNotFoundException("File not found: " + request.getFilePath());
        }

        Resource fileResource = new FileSystemResource(filePath);
        String encodedFileName = java.net.URLEncoder.encode(request.getFileName(), "UTF-8").replace("+", "%20");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename*=UTF-8''" + encodedFileName)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileResource);
    }

    // Update a request by ID
    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<RequestDTO> updateRequest(@PathVariable Long id,
            @RequestParam("request") String requestData,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            RequestDTO requestDTO = new ObjectMapper().readValue(requestData, RequestDTO.class);

            if (file == null || file.isEmpty()) {
                RequestDTO updatedRequest = requestService.updateRequest(id, requestDTO);
                return new ResponseEntity<>(updatedRequest, HttpStatus.OK);
            }

            RequestDTO updatedRequest = requestService.updateRequestWithFile(id, requestDTO, file);
            return new ResponseEntity<>(updatedRequest, HttpStatus.OK);
        } catch (ResourceNotFoundException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Delete a request by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRequest(@PathVariable Long id) {
        try {
            requestService.deleteRequest(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
