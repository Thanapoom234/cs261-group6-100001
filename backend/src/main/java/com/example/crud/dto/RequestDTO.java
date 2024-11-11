package com.example.crud.dto;

import lombok.Data;

@Data
public class RequestDTO {
    private Long id;
    private String status;
    private String subject;
    private String recipient;
    private String firstName;
    private String lastName;
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
    private String comment;
}