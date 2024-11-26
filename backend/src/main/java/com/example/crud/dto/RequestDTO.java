package com.example.crud.dto;

import lombok.Data;

@Data
public class RequestDTO {
    private Long id;
    private String updatedAt;
    private String subject;
    private String recipient;
    private String name;
    private String studentId;
    private String major;
    private String addressNumber;
    private String subDistrict;
    private String district;
    private String province;
    private String studentPhone;
    private String parentPhone;
    private String advisor;
    private String requestType;
    private String semester;
    private String academicYear;
    private String courseCode;
    private String courseName;
    private String section;
    private String startSemester;
    private String startAcademicYear;
    private String debtStatus;
    private String debtAmount;
    private String status;
    private String waitFor;
    private String commentByStaff;
    private String commentByAdvisor;
    private String commentByLecturer;
    private String commentByDean;
    private String fileName;
    private String fileType;
    private String filePath;
}