const API_BASE = 'http://localhost:5000'

fetch(`${API_BASE}/users`)
.then((res) => res.json())
.then(data => {

    const usersDiv = document.getElementById("users");

    data.forEach(user => {

        usersDiv.innerHTML += `
            <div class="user-card">
                <h3>${user.user_name}</h3>
                <p>${user.email}</p>
                <p>${user.preferences}</p>
            </div>
        `;

    });

});