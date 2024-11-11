window.addEventListener("load", async function () {
	const user = await fetchUser();
	document.getElementById("displayname").innerText = user.displayname_th;

	fetchData(user.type);
	if (user.type === "professor") {
		document.getElementById("addBtn").style.display = "none";
	}
});

async function fetchUser() {
	try {
		const response = await fetch("/api/user");
		if (!response.ok) throw new Error("Unauthorized");
		const data = await response.json();
		return data.user;
	} catch (error) {
		console.error("Error:", error);
	}
}

function fetchData(type) {
	fetch("http://localhost:8080/api/requests")
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("Failed to fetch requests");
			}
		})
		.then((data) => {
			if (!data || data.length === 0) {
				document.getElementById("data").innerHTML = `
				<div class="card shadow-sm">
                    <div class="d-flex justify-content-center py-4">
                        <h5 class="my-auto">
                            ไม่พบรายการ
                        </h5>
                    </div>
                </div>`;
				return;
			}

			document.getElementById("data").innerHTML = data
				.map((item) => {
					// กำหนดสีตามสถานะของคำร้อง
					let color;
					switch (item.status) {
						case "รออนุมัติ":
							color = "warning";
							break;
						case "อนุมัติ":
							color = "success";
							break;
						case "ไม่อนุมัติ":
							color = "danger";
							break;
						default:
							color = "secondary";
					}

					// ถ้าเป็นอาจารย์และคำร้องไม่ได้อยู่ในสถานะ "รออนุมัติ" ให้ข้ามไป
					if (type === "professor" && item.status !== "รออนุมัติ") {
						return "";
					}

					// การแสดงรายการคำร้อง
					return `
                        <div class="card shadow-sm p-4 mb-3 position-relative">
                            <div class="d-flex justify-content-between">
                                <div class="d-flex gap-2">
                                    <div class="rounded h-100 bg-${color}" style="width: 6px;"></div>
                                    <h4 class="mt-1">${item.subject}</h4>
                                </div>
                                <h5 class="my-auto text-${color} position-absolute start-50 top-50 translate-middle">
                                    ${item.status}
                                </h5>
                                <div class="d-flex gap-2">
                                    ${
																			item.status === "แบบร่าง" &&
																			type === "student"
																				? `
                                        <button class="btn btn-danger" onclick="deleteRequest(${item.id})">
                                            ลบ
                                        </button>
                                        <button class="btn btn-primary" onclick="updateRequest(${item.id})">
                                            แก้ไข
                                        </button>
                                    `
																				: ""
																		}
                                    ${
																			item.status === "รออนุมัติ" &&
																			type === "student"
																				? `
                                        <button class="btn btn-warning" onclick="updateStatus(${item.id}, 'แบบร่าง')">
                                            ยกเลิก
                                        </button>
                                    `
																				: ""
																		}
                                    ${
																			item.status === "ไม่อนุมัติ" ||
																			item.status === "อนุมัติ"
																				? `
                                        <button class="btn btn-primary" onclick="detailBtn(${item.id}, 'student')">
                                            ดูรายละเอียด
                                        </button>
                                    `
																				: ""
																		}
                                    ${
																			type === "professor"
																				? `
                                        <button class="btn btn-primary" onclick="detailBtn(${item.id}, 'professor')">
                                            ดูรายละเอียด
                                        </button>
                                    `
																				: ""
																		}
                                </div>
                            </div>
                        </div>
                    `;
				})
				.join("");
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

async function showModal(id, type) {
	var myModal = new bootstrap.Modal(document.getElementById("resultModal"));
	myModal.show();

	if (id === "create") {
		// กรณีสร้างคำร้องใหม่
		const user = await fetchUser();
		document.getElementById("subject").value = "";
		document.getElementById("recipient").value =
			"คณบดีคณะวิทยาศาสตร์และเทคโนโลยี";
		document.getElementById("firstName").value =
			user.displayname_th.split(" ")[0];
		document.getElementById("lastName").value =
			user.displayname_th.split(" ")[1];
		document.getElementById("studentId").value = user.username;
		document.getElementById("major").value = "";
		document.getElementById("addressNumber").value = "";
		document.getElementById("subDistrict").value = "";
		document.getElementById("district").value = "";
		document.getElementById("province").value = "";
		document.getElementById("studentPhone").value = "";
		document.getElementById("parentPhone").value = "";
		document.getElementById("advisor").value = "";
		document.getElementById("requestType").value = "";
		document.getElementById("commentBox").innerHTML = ``;
		requestTypeChange("");
		disabledInput(false, "");
	}

	if (type === "professor") {
		// กรณีที่เป็นอาจารย์ดูคำร้อง
		document.getElementById("commentBox").innerHTML = `
            <div class="modal-header"></div>
            <div class="modal-header">
                <h5>ความเห็นอาจารย์ที่ปรึกษา <span class="text-danger">*</span></h5>
            </div>
            <div class="modal-body">
                <textarea class="w-100" id="comment" required></textarea>
            </div>
        `;
		document.getElementById("formButton").innerHTML = `
            <button onclick="submitForm(event, 'ไม่อนุมัติ', '${id}', '${type}')" class="btn btn-danger">ไม่อนุมัติ</button>
            <button onclick="submitForm(event, 'อนุมัติ', '${id}', '${type}')" class="btn btn-success">อนุมัติ</button>
        `;
	} else if (type === "student") {
		// กรณีนักศึกษาดูคำร้อง
		document.getElementById("formButton").innerHTML = `
            <button onclick="submitForm(event, 'แบบร่าง', '${id}', '${type}')" class="btn btn-secondary">บันทึก</button>
            <button onclick="submitForm(event, 'รออนุมัติ', '${id}', '${type}')" class="btn btn-primary">ส่งคำร้อง</button>
        `;
	}
}

function requestTypeChange(value) {
	const form = document.getElementById("moreForm");
	if (value === "") {
		form.innerHTML = ``;
	} else if (value !== "resign") {
		form.innerHTML = `
            <div class="row">
                <div class="form-group col-md-6">
                    <label for="semester">ภาคการศึกษาที่</label>
                    <input type="text" class="form-control" id="semester" required>
                </div>
                <div class="form-group col-md-6">
                    <label for="academicYear">ปีการศึกษา</label>
                    <input type="text" class="form-control" id="academicYear" required>
                </div>
            </div>
            <div class="row">
                <div class="form-group col-md-4">
                    <label for="courseCode">รหัสวิชา</label>
                    <input type="text" class="form-control" id="courseCode" required>
                </div>
                <div class="form-group col-md-4">
                    <label for="courseName">ชื่อวิชา</label>
                    <input type="text" class="form-control" id="courseName" required>
                </div>
                <div class="form-group col-md-4">
                    <label for="section">Section</label>
                    <input type="text" class="form-control" id="section" required>
                </div>
            </div>
        `;
	} else {
		form.innerHTML = `
            <div class="row">
                <div class="form-group col-md-6">
                    <label for="startSemester">ตั้งแต่ภาคการศึกษาที่</label>
                    <input type="text" class="form-control" id="startSemester" required>
                </div>
                <div class="form-group col-md-6">
                    <label for="startAcademicYear">ปีการศึกษา</label>
                    <input type="text" class="form-control" id="startAcademicYear" required>
                </div>
            </div>
            <div class="row">
                <label>ข้าพเจ้ารับรองว่าไม่มีภาระหนี้ผูกพันกับมหาวิทยาลัย</label>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="debtStatus" id="noDebt" value="noDebt" onchange="toggleDebtAmount(false)" required>
                    <label class="form-check-label" for="noDebt">ไม่มีภาระหนี้สินคงค้าง</label>
                </div>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="debtStatus" id="hasDebt" value="hasDebt" onchange="toggleDebtAmount(true)" required>
                    <label class="form-check-label" for="hasDebt">มีภาระหนี้สินคงค้าง</label>
                    <input type="text" class="form-control mt-2" id="debtAmount" placeholder="ระบุจำนวน" value="0" required disabled>
                </div>
            </div>
        `;
	}
}

function toggleDebtAmount(hasDebt) {
	const debtAmountField = document.getElementById("debtAmount");
	if (hasDebt) {
		debtAmountField.disabled = false;
		debtAmountField.value = "0";
	} else {
		debtAmountField.disabled = true;
		debtAmountField.value = "0";
	}
}

function submitForm(event, status, id, type) {
	event.preventDefault();

	// เก็บข้อมูลพื้นฐานของฟอร์ม
	const baseRequestData = {
		status: status,
		subject: document.getElementById("subject").value,
		recipient: document.getElementById("recipient").value,
		firstName: document.getElementById("firstName").value,
		lastName: document.getElementById("lastName").value,
		studentId: document.getElementById("studentId").value,
		major: document.getElementById("major").value,
		addressNumber: document.getElementById("addressNumber").value,
		subDistrict: document.getElementById("subDistrict").value,
		district: document.getElementById("district").value,
		province: document.getElementById("province").value,
		studentPhone: document.getElementById("studentPhone").value,
		parentPhone: document.getElementById("parentPhone").value,
		advisor: document.getElementById("advisor").value,
		requestType: document.getElementById("requestType").value,
	};

	// เก็บข้อมูลเพิ่มเติมตามประเภทคำร้อง
	const requestData =
		baseRequestData.requestType === "resign"
			? {
					...baseRequestData,
					startSemester: document.getElementById("startSemester").value,
					startAcademicYear: document.getElementById("startAcademicYear").value,
					debtStatus: document.querySelector('input[name="debtStatus"]:checked')
						.value,
					debtAmount: document.getElementById("debtAmount").value,
			  }
			: {
					...baseRequestData,
					semester: document.getElementById("semester").value,
					academicYear: document.getElementById("academicYear").value,
					courseCode: document.getElementById("courseCode").value,
					courseName: document.getElementById("courseName").value,
					section: document.getElementById("section").value,
			  };

	if (type === "professor") {
		requestData.comment = document.getElementById("comment").value;
	}

	if (Object.values(requestData).some((value) => value === "")) {
		alert("กรุณากรอกข้อมูลให้ครบถ้วน");
		return;
	}

	// ส่งคำร้องไปที่ backend
	fetch(
		`http://localhost:8080/api/requests${id === "create" ? "" : "/" + id}`,
		{
			method: id === "create" ? "POST" : "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(requestData),
		}
	)
		.then((response) => {
			if (!response.ok) throw new Error("Failed to submit request");
			return response.json();
		})
		.then((data) => {
			closeModal();
			fetchData(type);
		})
		.catch((error) => {
			console.error("Error:", error);
			alert("Error:", error);
		});
}

function closeModal() {
	const modalElement = document.getElementById("resultModal");
	const modalInstance = bootstrap.Modal.getInstance(modalElement);
	if (modalInstance) {
		modalInstance.hide();
	} else {
		console.error("Modal instance not found");
	}
}

function deleteRequest(id) {
	if (confirm("ยืนยันการลบคำร้องนี้?")) {
		fetch(`http://localhost:8080/api/requests/${id}`, {
			method: "DELETE",
		})
			.then(async (response) => {
				if (response.ok) {
					const user = await fetchUser(); // เรียกข้อมูลผู้ใช้ปัจจุบัน
					fetchData(user.type); // โหลดข้อมูลใหม่หลังจากลบคำร้อง
				} else {
					throw new Error("Failed to delete request");
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				alert("เกิดข้อผิดพลาดในการลบคำร้อง");
			});
	}
}

function updateStatus(id, status) {
	if (confirm("ยืนยันการเปลี่ยนสถานะคำร้องนี้?")) {
		fetch(`http://localhost:8080/api/requests/status/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: status, // ส่งสถานะใหม่ไปที่ backend
		})
			.then(async (response) => {
				if (response.ok) {
					const user = await fetchUser(); // เรียกข้อมูลผู้ใช้ปัจจุบัน
					fetchData(user.type); // โหลดข้อมูลใหม่หลังจากเปลี่ยนสถานะ
				} else {
					throw new Error("Failed to update request status");
				}
			})
			.catch((error) => {
				console.error("Error:", error);
				alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะคำร้อง");
			});
	}
}

function updateRequest(id) {
	fetch(`http://localhost:8080/api/requests/${id}`)
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("Failed to fetch request details");
			}
		})
		.then((data) => {
			showModal(data.id, "student"); // เปิด modal เพื่อแก้ไขคำร้อง
			document.getElementById("subject").value = data.subject;
			document.getElementById("recipient").value = data.recipient;
			document.getElementById("firstName").value = data.firstName;
			document.getElementById("lastName").value = data.lastName;
			document.getElementById("studentId").value = data.studentId;
			document.getElementById("major").value = data.major;
			document.getElementById("addressNumber").value = data.addressNumber;
			document.getElementById("subDistrict").value = data.subDistrict;
			document.getElementById("district").value = data.district;
			document.getElementById("province").value = data.province;
			document.getElementById("studentPhone").value = data.studentPhone;
			document.getElementById("parentPhone").value = data.parentPhone;
			document.getElementById("advisor").value = data.advisor;
			document.getElementById("requestType").value = data.requestType;

			requestTypeChange(data.requestType); // อัปเดตฟอร์มตามประเภทคำร้อง

			// ตรวจสอบว่าคำร้องเป็นประเภทอะไร เช่น ลาออก (resign)
			if (data.requestType === "resign") {
				document.getElementById("startSemester").value = data.startSemester;
				document.getElementById("startAcademicYear").value =
					data.startAcademicYear;
				document.querySelector(
					`input[name="debtStatus"][value="${data.debtStatus}"]`
				).checked = true;
				toggleDebtAmount(data.debtStatus === "hasDebt");
				document.getElementById("debtAmount").value = data.debtAmount;
			} else {
				document.getElementById("semester").value = data.semester;
				document.getElementById("academicYear").value = data.academicYear;
				document.getElementById("courseCode").value = data.courseCode;
				document.getElementById("courseName").value = data.courseName;
				document.getElementById("section").value = data.section;
			}
			disabledInput(false, data.requestType);
			document.getElementById("commentBox").innerHTML = ""; // ล้างช่องคอมเมนต์
		})
		.catch((error) => {
			console.error("Error:", error);
			alert("เกิดข้อผิดพลาดในการดึงข้อมูลคำร้อง");
		});
}

function detailBtn(id, type) {
	fetch(`http://localhost:8080/api/requests/${id}`)
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("Failed to fetch request details");
			}
		})
		.then((data) => {
			if (type === "professor") {
				showModal(data.id, "professor"); // เปิด modal สำหรับอาจารย์
			} else {
				showModal(data.id, "studentDetail"); // เปิด modal สำหรับนักศึกษา
			}

			// กรอกข้อมูลคำร้องในฟอร์ม
			document.getElementById("subject").value = data.subject;
			document.getElementById("recipient").value = data.recipient;
			document.getElementById("firstName").value = data.firstName;
			document.getElementById("lastName").value = data.lastName;
			document.getElementById("studentId").value = data.studentId;
			document.getElementById("major").value = data.major;
			document.getElementById("addressNumber").value = data.addressNumber;
			document.getElementById("subDistrict").value = data.subDistrict;
			document.getElementById("district").value = data.district;
			document.getElementById("province").value = data.province;
			document.getElementById("studentPhone").value = data.studentPhone;
			document.getElementById("parentPhone").value = data.parentPhone;
			document.getElementById("advisor").value = data.advisor;
			document.getElementById("requestType").value = data.requestType;

			requestTypeChange(data.requestType); // อัปเดตฟอร์มตามประเภทคำร้อง

			// ถ้าเป็นประเภทลาออก
			if (data.requestType === "resign") {
				document.getElementById("startSemester").value = data.startSemester;
				document.getElementById("startAcademicYear").value =
					data.startAcademicYear;
				document.querySelector(
					`input[name="debtStatus"][value="${data.debtStatus}"]`
				).checked = true;
				document.getElementById("debtAmount").value = data.debtAmount;
			} else {
				document.getElementById("semester").value = data.semester;
				document.getElementById("academicYear").value = data.academicYear;
				document.getElementById("courseCode").value = data.courseCode;
				document.getElementById("courseName").value = data.courseName;
				document.getElementById("section").value = data.section;
			}

			disabledInput(true, data.requestType); // ปิดการแก้ไขฟอร์ม

			// กรณีที่เป็นนักศึกษา ให้แสดงคอมเมนต์ของอาจารย์ด้วย
			if (type === "student") {
				document.getElementById("commentBox").innerHTML = `
                    <div class="modal-header"></div>
                    <div class="modal-header">
                        <h5>ความเห็นอาจารย์ที่ปรึกษา</h5>
                    </div>
                    <div class="modal-body">
                        <textarea class="w-100" id="comment" disabled></textarea>
                    </div>
                `;
				document.getElementById("comment").value = data.comment;
				document.getElementById("formButton").innerHTML = "";
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			alert("เกิดข้อผิดพลาดในการดึงข้อมูลคำร้อง");
		});
}

function logout() {
	if (confirm("ยืนยันการออกจากระบบ?")) {
		fetch("/logout")
			.then((response) => {
				if (response.redirected) {
					window.location.href = response.url;
				}
			})
			.catch((error) => console.error("Error logging out:", error));
	}
}

function disabledInput(value, type) {
	document.getElementById("subject").disabled = value;
	document.getElementById("recipient").disabled = value;
	document.getElementById("firstName").disabled = value;
	document.getElementById("lastName").disabled = value;
	document.getElementById("studentId").disabled = value;
	document.getElementById("major").disabled = value;
	document.getElementById("addressNumber").disabled = value;
	document.getElementById("subDistrict").disabled = value;
	document.getElementById("district").disabled = value;
	document.getElementById("province").disabled = value;
	document.getElementById("studentPhone").disabled = value;
	document.getElementById("parentPhone").disabled = value;
	document.getElementById("advisor").disabled = value;
	document.getElementById("requestType").disabled = value;

	if (type === "") return;

	if (type === "resign") {
		document.getElementById("startSemester").disabled = value;
		document.getElementById("startAcademicYear").disabled = value;
		document.getElementById("noDebt").disabled = value;
		document.getElementById("hasDebt").disabled = value;
		document.getElementById("debtAmount").disabled = value;
	} else {
		document.getElementById("semester").disabled = value;
		document.getElementById("academicYear").disabled = value;
		document.getElementById("courseCode").disabled = value;
		document.getElementById("courseName").disabled = value;
		document.getElementById("section").disabled = value;
	}
}
