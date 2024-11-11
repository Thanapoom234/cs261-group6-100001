package com.example.crud.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;


@Data
@Entity
@Table(name = "requests")  // Table name
public class Request {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "status", nullable = false)
	private String status;

	@Column(name = "subject", nullable = false)
	private String subject;

	@Column(name = "recipient", nullable = false)
	private String recipient;

	@Column(name = "first_name", nullable = false)
	private String firstName;

	@Column(name = "last_name", nullable = false)
	private String lastName;

	@Column(name = "student_id", nullable = false)
	private String studentId;

	@Column(name = "major", nullable = false)
	private String major;

	@Column(name = "address_number", nullable = false)
	private String addressNumber;

	@Column(name = "sub_district", nullable = false)
	private String subDistrict;

	@Column(name = "district", nullable = false)
	private String district;

	@Column(name = "province", nullable = false)
	private String province;

	@Column(name = "student_phone", nullable = false)
	private String studentPhone;

	@Column(name = "parent_phone", nullable = false)
	private String parentPhone;

	@Column(name = "advisor", nullable = false)
	private String advisor;

	@Column(name = "request_type", nullable = false)
	private String requestType;

	@Column(name = "semester")
	private String semester;

	@Column(name = "academic_year")
	private String academicYear;

	@Column(name = "course_code")
	private String courseCode;

	@Column(name = "course_name")
	private String courseName;

	@Column(name = "section")
	private String section;

	@Column(name = "start_semester")
	private String startSemester;

	@Column(name = "start_academic_year")
	private String startAcademicYear;

	@Column(name = "debt_status")
	private String debtStatus;

	@Column(name = "debt_amount")
	private String debtAmount;

	@Column(name = "comment")
	private String comment;
}
