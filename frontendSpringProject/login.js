document.getElementById("loginForm").addEventListener("submit", async function(event) {

    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const credentials = btoa(username + ":" + password);

    try {

        const response = await fetch("http://localhost:8080/api/products", {
            method: "GET",
            headers: {
                "Authorization": "Basic " + credentials
            }
        });

        if (response.ok) {

            sessionStorage.setItem("auth", credentials);
            sessionStorage.setItem("username", username);

            window.location.href = "index.html";

        } else {

            document.getElementById("errorMessage").style.display = "block";
        }

    } catch (error) {

        console.error(error);

        alert("Unable to connect to Spring Boot server.");
    }

});