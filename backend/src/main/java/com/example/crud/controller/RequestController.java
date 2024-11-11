package com.example.crud.controller;

import com.example.crud.dto.RequestDTO;
import com.example.crud.exception.ResourceNotFoundException;
import com.example.crud.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(value = "/api/requests", produces = "application/json; charset=UTF-8")
@CrossOrigin(origins = "http://localhost:3000")
public class RequestController {

    private final RequestService requestService;

    @Autowired
    public RequestController(RequestService requestService) {
        this.requestService = requestService;
    }

    // Save a new request
    @PostMapping
    public ResponseEntity<RequestDTO> createRequest(@RequestBody RequestDTO requestDTO) {
        RequestDTO savedRequest = requestService.saveRequest(requestDTO);
        return new ResponseEntity<>(savedRequest, HttpStatus.CREATED);
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

    // Update request status by ID
    @PutMapping("/status/{id}")
    public ResponseEntity<RequestDTO> updateRequestStatus(@PathVariable Long id, @RequestBody String status) {
        try {
            RequestDTO existingRequest = requestService.getRequestById(id);
            if (status != null && !status.trim().isEmpty()) {
                existingRequest.setStatus(status);
                RequestDTO updatedRequest = requestService.updateRequest(id, existingRequest);
                return new ResponseEntity<>(updatedRequest, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // If status is missing
            }
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Update a request by ID
    @PutMapping("/{id}")
    public ResponseEntity<RequestDTO> updateRequest(@PathVariable Long id, @RequestBody RequestDTO requestDetails) {
        try {
            RequestDTO updatedRequest = requestService.updateRequest(id, requestDetails);
            return new ResponseEntity<>(updatedRequest, HttpStatus.OK);
        } catch (ResourceNotFoundException ex) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
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
