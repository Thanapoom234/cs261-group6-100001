document.getElementById("loginForm").addEventListener("submit", submitLogin);

function togglePassword() {
    const passwordField = document.getElementById("password");
    const toggleButton = document.getElementById("toggleButton");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        toggleButton.innerHTML = '<img src="./img/eye-slash-icon.svg" alt="Eye Slash Icon" width="20" height="20">';
    } else {
        passwordField.type = "password";
        toggleButton.innerHTML = '<img src="./img/eye-icon.svg" alt="Eye Icon" width="20" height="20">';
    }
}