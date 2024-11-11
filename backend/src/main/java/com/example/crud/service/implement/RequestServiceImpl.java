package com.example.crud.service.implement;

import com.example.crud.dto.RequestDTO;
import com.example.crud.entities.Request;
import com.example.crud.exception.ResourceNotFoundException;
import com.example.crud.repository.RequestRepository;
import com.example.crud.service.RequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequestServiceImpl implements RequestService {

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

    // Method to map Request entity to RequestDTO
    private RequestDTO mapToDTO(Request request) {
        RequestDTO dto = new RequestDTO();
        dto.setId(request.getId());
        dto.setStatus(request.getStatus());
        dto.setSubject(request.getSubject());
        dto.setRecipient(request.getRecipient());
        dto.setFirstName(request.getFirstName());
        dto.setLastName(request.getLastName());
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
        dto.setComment(request.getComment());
        return dto;
    }

    // Method to map RequestDTO to Request entity
    private Request mapToEntity(RequestDTO dto) {
        Request request = new Request();
        request.setStatus(dto.getStatus());
        request.setSubject(dto.getSubject());
        request.setRecipient(dto.getRecipient());
        request.setFirstName(dto.getFirstName());
        request.setLastName(dto.getLastName());
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
        request.setComment(dto.getComment());
        return request;
    }

    // Method to update Request entity fields from RequestDTO
    private void updateEntityFromDTO(Request request, RequestDTO dto) {
        request.setStatus(dto.getStatus());
        request.setSubject(dto.getSubject());
        request.setRecipient(dto.getRecipient());
        request.setFirstName(dto.getFirstName());
        request.setLastName(dto.getLastName());
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
        request.setComment(dto.getComment());
    }
}