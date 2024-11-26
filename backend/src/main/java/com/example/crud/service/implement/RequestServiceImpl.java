package com.example.crud.service.implement;

import com.example.crud.dto.RequestDTO;
import com.example.crud.entities.Request;
import com.example.crud.exception.ResourceNotFoundException;
import com.example.crud.repository.RequestRepository;
import com.example.crud.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestServiceImpl implements RequestService {

    private static final String FOLDER_PATH = "uploads/";

    @Autowired
    private RequestRepository requestRepository;

    @Override
    public RequestDTO saveRequest(RequestDTO requestDTO) {
        Request request = mapToEntity(requestDTO);
        Request savedRequest = requestRepository.save(request);
        return mapToDTO(savedRequest);
    }

    @Override
    public RequestDTO getRequestById(Long id) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));
        return mapToDTO(request);
    }

    @Override
    public List<RequestDTO> getAllRequests() {
        List<Request> requests = requestRepository.findAll();
        return requests.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RequestDTO updateRequest(Long id, RequestDTO requestDTO) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));

        // Update the entity with the new data from requestDTO
        updateEntityFromDTO(request, requestDTO);

        Request updatedRequest = requestRepository.save(request);
        return mapToDTO(updatedRequest);
    }

    @Override
    public void deleteRequest(Long id) {
        Request request = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));
        requestRepository.delete(request);
    }

    @Override
    public RequestDTO saveRequestWithFile(RequestDTO requestDTO, MultipartFile file) throws IOException {
        // Save the file to the server
        String fileName = saveFile(file);

        // Map DTO to Entity and add file info
        Request request = mapToEntity(requestDTO);
        request.setFileName(file.getOriginalFilename());
        request.setFileType(file.getContentType());
        request.setFilePath(FOLDER_PATH + fileName);

        // Save to the database
        Request savedRequest = requestRepository.save(request);
        return mapToDTO(savedRequest);
    }

    @Override
    public RequestDTO updateRequestWithFile(Long id, RequestDTO requestDTO, MultipartFile file) throws IOException {
        Request existingRequest = requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + id));

        // Update fields
        updateEntityFromDTO(existingRequest, requestDTO);

        if (file != null) {
            // Save the new file and update file info
            String fileName = saveFile(file);
            existingRequest.setFileName(file.getOriginalFilename());
            existingRequest.setFileType(file.getContentType());
            existingRequest.setFilePath(FOLDER_PATH + fileName);
        }

        // Save the updated entity to the database
        Request updatedRequest = requestRepository.save(existingRequest);
        return mapToDTO(updatedRequest);
    }

    private String saveFile(MultipartFile file) throws IOException {
        Path folderPath = Paths.get(FOLDER_PATH);
        if (!Files.exists(folderPath)) {
            Files.createDirectories(folderPath);
        }

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = folderPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        return fileName;
    }

    @Override
    public List<RequestDTO> getRequestsByWaitFor(String waitFor) {
        // Fetch all requests matching the given waitFor field
        List<Request> requests = requestRepository.findByWaitFor(waitFor);
        return requests.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RequestDTO> getRequestsByName(String name) {
        // Fetch all requests matching the given waitFor field
        List<Request> requests = requestRepository.findByName(name);
        return requests.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Method to map Request entity to RequestDTO
    private RequestDTO mapToDTO(Request request) {
        RequestDTO dto = new RequestDTO();
        dto.setId(request.getId());
        dto.setUpdatedAt(request.getUpdatedAt());
        dto.setSubject(request.getSubject());
        dto.setRecipient(request.getRecipient());
        dto.setName(request.getName());
        dto.setStudentId(request.getStudentId());
        dto.setMajor(request.getMajor());
        dto.setAddressNumber(request.getAddressNumber());
        dto.setSubDistrict(request.getSubDistrict());
        dto.setDistrict(request.getDistrict());
        dto.setProvince(request.getProvince());
        dto.setStudentPhone(request.getStudentPhone());
        dto.setParentPhone(request.getParentPhone());
        dto.setAdvisor(request.getAdvisor());
        dto.setRequestType(request.getRequestType());
        dto.setSemester(request.getSemester());
        dto.setAcademicYear(request.getAcademicYear());
        dto.setCourseCode(request.getCourseCode());
        dto.setCourseName(request.getCourseName());
        dto.setSection(request.getSection());
        dto.setStartSemester(request.getStartSemester());
        dto.setStartAcademicYear(request.getStartAcademicYear());
        dto.setDebtStatus(request.getDebtStatus());
        dto.setDebtAmount(request.getDebtAmount());
        dto.setStatus(request.getStatus());
        dto.setWaitFor(request.getWaitFor());
        dto.setCommentByStaff(request.getCommentByStaff());
        dto.setCommentByAdvisor(request.getCommentByAdvisor());
        dto.setCommentByLecturer(request.getCommentByLecturer());
        dto.setCommentByDean(request.getCommentByDean());
        dto.setFileName(FOLDER_PATH + request.getFileName());
        dto.setFileType(FOLDER_PATH + request.getFileType());
        dto.setFilePath(FOLDER_PATH + request.getFilePath());
        return dto;
    }

    // Method to map RequestDTO to Request entity
    private Request mapToEntity(RequestDTO dto) {
        Request request = new Request();

        request.setUpdatedAt(dto.getUpdatedAt());
        request.setSubject(dto.getSubject());
        request.setRecipient(dto.getRecipient());
        request.setName(dto.getName());
        request.setStudentId(dto.getStudentId());
        request.setMajor(dto.getMajor());
        request.setAddressNumber(dto.getAddressNumber());
        request.setSubDistrict(dto.getSubDistrict());
        request.setDistrict(dto.getDistrict());
        request.setProvince(dto.getProvince());
        request.setStudentPhone(dto.getStudentPhone());
        request.setParentPhone(dto.getParentPhone());
        request.setAdvisor(dto.getAdvisor());
        request.setRequestType(dto.getRequestType());
        request.setSemester(dto.getSemester());
        request.setAcademicYear(dto.getAcademicYear());
        request.setCourseCode(dto.getCourseCode());
        request.setCourseName(dto.getCourseName());
        request.setSection(dto.getSection());
        request.setStartSemester(dto.getStartSemester());
        request.setStartAcademicYear(dto.getStartAcademicYear());
        request.setDebtStatus(dto.getDebtStatus());
        request.setDebtAmount(dto.getDebtAmount());
        request.setStatus(dto.getStatus());
        request.setWaitFor(dto.getWaitFor());
        request.setCommentByStaff(dto.getCommentByStaff());
        request.setCommentByAdvisor(dto.getCommentByAdvisor());
        request.setCommentByLecturer(dto.getCommentByLecturer());
        request.setCommentByDean(dto.getCommentByDean());
        return request;
    }

    // Method to update Request entity fields from RequestDTO
    private void updateEntityFromDTO(Request request, RequestDTO dto) {
        request.setUpdatedAt(dto.getUpdatedAt());
        request.setSubject(dto.getSubject());
        request.setRecipient(dto.getRecipient());
        request.setName(dto.getName());
        request.setStudentId(dto.getStudentId());
        request.setMajor(dto.getMajor());
        request.setAddressNumber(dto.getAddressNumber());
        request.setSubDistrict(dto.getSubDistrict());
        request.setDistrict(dto.getDistrict());
        request.setProvince(dto.getProvince());
        request.setStudentPhone(dto.getStudentPhone());
        request.setParentPhone(dto.getParentPhone());
        request.setAdvisor(dto.getAdvisor());
        request.setRequestType(dto.getRequestType());
        request.setSemester(dto.getSemester());
        request.setAcademicYear(dto.getAcademicYear());
        request.setCourseCode(dto.getCourseCode());
        request.setCourseName(dto.getCourseName());
        request.setSection(dto.getSection());
        request.setStartSemester(dto.getStartSemester());
        request.setStartAcademicYear(dto.getStartAcademicYear());
        request.setDebtStatus(dto.getDebtStatus());
        request.setDebtAmount(dto.getDebtAmount());
        request.setStatus(dto.getStatus());
        request.setWaitFor(dto.getWaitFor());
        request.setCommentByStaff(dto.getCommentByStaff());
        request.setCommentByAdvisor(dto.getCommentByAdvisor());
        request.setCommentByLecturer(dto.getCommentByLecturer());
        request.setCommentByDean(dto.getCommentByDean());
    }
}