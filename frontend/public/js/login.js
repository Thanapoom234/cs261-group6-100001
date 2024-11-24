document.getElementById("loginForm").addEventListener("submit", submitLogin);

function togglePassword() {
	const passwordField = document.getElementById("password");
	const toggleButton = document.getElementById("toggleButton");

	if (passwordField.type === "password") {
		passwordField.type = "text";
		toggleButton.innerHTML =
			'<img src="./img/eye-slash-icon.svg" alt="Eye Slash Icon" width="20" height="20">';
	} else {
		passwordField.type = "password";
		toggleButton.innerHTML =
			'<img src="./img/eye-icon.svg" alt="Eye Icon" width="20" height="20">';
	}
}

function submitLogin(e) {
	e.preventDefault();

	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;

	fetch("/api/auth", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ username, password }),
	})
		.then((response) => {
			if (response.redirected) {
				window.location.href = response.url;
			} else {
				return response.json();
			}
		})
		.then((data) => {
			if (data && data.error) {
				alert(data.error);
			}
		})
		.catch((error) => {
			console.error("Error:", error);
		});
}
