window.addEventListener("load", async function () {
	const user = await fetchUser();
	document.getElementById("displayname").innerText = user.displayname_th;

	fetchData(user.type);
	if (user.type === "student") {
		document.getElementById(
			"addBtn"
		).innerHTML = `<button onclick="showModal('create', 'student')" class="btn btn-outline-secondary d-flex gap-2" id="addBtn">
						<img
							src="./img/plus-circle.svg"
							alt="Icon"
							width="20"
							height="20"
							class="my-auto"
						/>
				<p class="my-1">สร้างคำร้อง</p>
			</button>`;
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

async function fetchData(type) {
	const user = await fetchUser();

	fetch(
		`http://localhost:8080/api/requests/fetch${
			type == "student" ? "/student" : ""
		}`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: user.displayname_th }),
		}
	)
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("Failed to fetch requests by waitFor");
			}
		})
		.then((data) => {
			showData(data, type);
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}

function showData(data, type) {
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
				case "แบบร่าง":
					color = "secondary";
					break;
				case "อนุมัติ":
					color = "success";
					break;
				case "ไม่อนุมัติ":
					color = "danger";
					break;
				default:
					color = "warning";
			}

			// การแสดงรายการคำร้อง
			return `
                        <div class="card shadow-sm p-4 mb-3 position-relative">
                            <div class="d-flex justify-content-between flex-column gap-4">
                                <div class="d-flex gap-2">
                                    <div class="rounded h-1 bg-${color}" style="width: 6px;"></div>
                                    <h4 class="mt-1">${item.subject}</h4>
                                </div>
                                <h5 class="my-auto text-${color} position-absolute start-50 top-50 translate-middle d-none">
                                    ${item.status}
                                </h5>
                                <div class="d-flex gap-2 justify-content-end">
                                    ${
																			item.status === "แบบร่าง"
																				? `
                                        <button class="btn btn-danger" onclick="deleteRequest('${item.id}')">
                                            ลบ
                                        </button>
                                        <button class="btn btn-primary" onclick="updateRequest('${item.id}')">
                                            แก้ไข
                                        </button>
                                    `
																				: ""
																		}
                                    ${
																			item.status.includes("รออนุมัติ") &&
																			type === "student"
																				? `
                                        <button class="btn btn-warning" onclick="cancelRequest(event, '${item.id}')">
                                            ยกเลิก
                                        </button>
                                    `
																				: ""
																		}
                                    ${
																			item.status.includes("อนุมัติ")
																				? `
                                        <button class="btn btn-primary" onclick="detailBtn('${item.id}', '${type}')">
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
}

async function showModal(id, type) {
	var myModal = new bootstrap.Modal(document.getElementById("resultModal"));
	myModal.show();

	if (id === "create") {
		// กรณีสร้างคำร้องใหม่
		const user = await fetchUser();
		document.getElementById("requestStatus").innerHTML = "";
		document.getElementById("subject").value = "";
		document.getElementById("recipient").value =
			"คณบดีคณะวิทยาศาสตร์และเทคโนโลยี";
		document.getElementById("name").value = user.displayname_th;
		document.getElementById("studentId").value = user.username;
		document.getElementById("major").value = user.department;
		document.getElementById("addressNumber").value = "";
		document.getElementById("subDistrict").value = "";
		document.getElementById("district").value = "";
		document.getElementById("province").value = "";
		document.getElementById("studentPhone").value = "";
		document.getElementById("parentPhone").value = "";
		document.getElementById("advisor").value = "";
		document.getElementById("requestType").value = "";
		document.getElementById("document-info").innerHTML = "";
		requestTypeChange("");
		disabledInput(false, "");
	}

	if (type === "student") {
		// กรณีนักศึกษาดูคำร้อง
		document.getElementById("formButton").innerHTML = `
            <button onclick="submitForm(event, 'แบบร่าง', '${id}', '${type}')" class="btn btn-secondary">บันทึก</button>
            <button onclick="submitForm(event, 'รออนุมัติจากเจ้าหน้าที่', '${id}', '${type}')" class="btn btn-primary">ส่งคำร้อง</button>
        `;
	}
}

function requestTypeChange(value) {
	const form = document.getElementById("moreForm");
	if (value === "") {
		form.innerHTML = ``;
	} else if (value !== "resign") {
		form.innerHTML = `
            <div class="row px-0 mx-0">
					<div class="form-group">
                    <label for="semester">ภาคการศึกษาที่</label>
                    <input type="text" class="form-control" id="semester" onblur="checkValue(this)" required>
                </div>
                <div class="form-group">
                    <label for="academicYear">ปีการศึกษา</label>
                    <input type="text" class="form-control" id="academicYear" onblur="checkValue(this)" required>
                </div>
            </div>
            <div class="row px-0 mx-0">
                <div class="form-group">
                    <label for="courseCode">รหัสวิชา</label>
                    <input type="text" class="form-control" id="courseCode" onblur="checkValue(this)" required>
                </div>
                <div class="form-group">
                    <label for="courseName">ชื่อวิชา</label>
                    <input type="text" class="form-control" id="courseName" onblur="checkValue(this)" required>
                </div>
                <div class="form-group">
                    <label for="section">Section</label>
                    <input type="text" class="form-control" id="section" onblur="checkValue(this)" required>
                </div>
            </div>
        `;
	} else {
		form.innerHTML = `
            <div class="row px-0 mx-0">
                <div class="form-group">
                    <label for="startSemester">ตั้งแต่ภาคการศึกษาที่</label>
                    <input type="text" class="form-control" id="startSemester" onblur="checkValue(this)" required>
                </div>
                <div class="form-group">
                    <label for="startAcademicYear">ปีการศึกษา</label>
                    <input type="text" class="form-control" id="startAcademicYear" onblur="checkValue(this)" required>
                </div>
            </div>
            <div class="row px-0 mx-0">
                <label>ข้าพเจ้ารับรองว่าไม่มีภาระหนี้ผูกพันกับมหาวิทยาลัย</label>
				<div class="form-group">
					<div class="form-check ms-2">
						<input class="form-check-input" type="radio" name="debtStatus" id="noDebt" value="noDebt" onchange="toggleDebtAmount(false)" onblur="checkValue(this)" required>
						<label class="form-check-label" for="noDebt">ไม่มีภาระหนี้สินคงค้าง</label>
					</div>
				</div>
				<div class="form-group">
					<div class="form-check ms-2">
						<input class="form-check-input" type="radio" name="debtStatus" id="hasDebt" value="hasDebt" onchange="toggleDebtAmount(true)" onblur="checkValue(this)" required>
						<label class="form-check-label" for="hasDebt">มีภาระหนี้สินคงค้าง</label>
					</div>
                	<input type="text" class="form-control mt-2" id="debtAmount" placeholder="ระบุจำนวน" value="0" onblur="checkValue(this)" required disabled>
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
		name: document.getElementById("name").value,
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

	if (Object.values(baseRequestData).some((value) => value === "")) {
		alert("กรุณากรอกข้อมูลให้ครบถ้วน");
		checkEmptyInputs();
		return;
	}

	if (!validateStudentPhoneNumber() || !validateParentPhoneNumber()) {
		alert("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง");
		return;
	}

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

	requestData.updatedAt = new Date().toISOString();

	if (Object.values(requestData).some((value) => value === "")) {
		alert("กรุณากรอกข้อมูลให้ครบถ้วน");
		checkEmptyInputs();
		return;
	}

	const formData = new FormData();
	formData.append("request", JSON.stringify(requestData));

	// ส่งคำร้องไปที่ backend
	fetch(
		`http://localhost:8080/api/requests${id === "create" ? "" : "/" + id}`,
		{
			method: id === "create" ? "POST" : "PUT",
			body: formData,
		}
	)
		.then((response) => {
			if (!response.ok) {
				throw new Error(
					response.status === 413
						? "ไฟล์มีขนาดใหญ่เกินไป กรุณาอัพโหลดไฟล์ที่มีขนาดไม่เกิน 10MB"
						: "เกิดข้อผิดพลาดในการส่งคำร้อง"
				);
			}
			return response.json();
		})
		.then(() => {
			closeModal();
			fetchData(type);
		})
		.catch((error) => {
			console.error(error);
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

function cancelRequest(event, id) {
	if (confirm("ยืนยันการเปลี่ยนสถานะคำร้องนี้?")) {
		event.preventDefault();

		fetch(`http://localhost:8080/api/requests/${id}`)
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Failed to fetch request details");
				}
			})
			.then((data) => {
				const requestData = data;

				requestData.status = "แบบร่าง";
				requestData.updatedAt = new Date().toISOString();

				const formData = new FormData();
				formData.append("request", JSON.stringify(requestData));

				fetch(`http://localhost:8080/api/requests/${id}`, {
					method: "PUT",
					body: formData,
				})
					.then((response) => {
						if (response.ok) {
							fetchData("student");
						} else {
							throw new Error("Failed to cancel request");
						}
					})
					.catch((error) => {
						console.error("Error:", error);
						alert("เกิดข้อผิดพลาดในการเปลี่ยนสถานะคำร้อง");
					});
			})
			.catch((error) => {
				console.error("Error:", error);
				alert("เกิดข้อผิดพลาดในการดึงข้อมูลคำร้อง");
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
			document.getElementById("name").value = data.name;
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

			const documentInfo = document.getElementById("document-info");
			if (data.fileName !== "uploads/null") {
				documentInfo.innerHTML = `
				ไฟล์แนบ: 
				<a href="http://localhost:8080/api/requests/${data.id}/download" target="_blank" rel="noopener noreferrer">
				${data.fileName}
				</a>
				`;
			}

			disabledInput(false, data.requestType);
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
			showModal(data.id, type);

			let color;
			switch (data.status) {
				case "แบบร่าง":
					color = "secondary";
					break;
				case "อนุมัติ":
					color = "success";
					break;
				case "ไม่อนุมัติ":
					color = "danger";
					break;
				default:
					color = "warning";
			}
			document.getElementById("requestStatus").classList.add(`text-${color}`);

			document.getElementById("requestStatus").innerHTML =
				"(" + data.status + ")";
			document.getElementById("subject").value = data.subject;
			document.getElementById("recipient").value = data.recipient;
			document.getElementById("name").value = data.name;
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

			const documentInfo = document.getElementById("document-info");
			if (data.fileName !== "uploads/null") {
				documentInfo.innerHTML = `
					ไฟล์แนบ: 
					<a href="http://localhost:8080/api/requests/${data.id}/download" target="_blank" rel="noopener noreferrer">
						${data.fileName}
					</a>
				`;
			}

			disabledInput(true, data.requestType); // ปิดการแก้ไขฟอร์ม

			//กรณีที่เป็นนักศึกษา ให้แสดงคอมเมนต์ของอาจารย์ด้วย
			if (type === "student") {
				document.getElementById("formButton").innerHTML = "";
			} else {
				document.getElementById("formButton").innerHTML = `
				<button onclick="submitForm(event, 'ไม่อนุมัติ', '${id}', '${type}')" class="btn btn-danger">ไม่อนุมัติ</button>
				<button onclick="submitForm(event, '${status}', '${id}', '${type}')" class="btn btn-success">อนุมัติ</button>
				`;
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
