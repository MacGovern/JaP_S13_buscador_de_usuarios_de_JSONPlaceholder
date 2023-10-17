const results = document.getElementById("results");

function removeDiacritics(str) { // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript (primera respuesta).
    return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

document.getElementById("searchButton").addEventListener("click", () => {
    const name = document.getElementById("searchInput").value.trim();
    if (name !== '')
        searchUsers(removeDiacritics(name).toLowerCase());
});

function showDetails(userId) {
    results.querySelectorAll(`.${userId}`).forEach(detailsDiv => {
        if (detailsDiv.classList.contains('d-none')) {
            detailsDiv.classList.replace('d-none', 'd-block')
        } else {
            detailsDiv.classList.replace('d-block', 'd-none');
        }
    });
}

function displayResults(users) {
    results.innerHTML = "";
    users.forEach((user) => {
        results.innerHTML += `
            <div class="list-group-item list-group-item-action cursor-active" onclick="showDetails('extraInformation-${user.id}')">
                <div class="row d-flex justify-content-between align-items-center">
                    <div class="col-auto p-4 mx-4">
                        <h2>${user.name}</h2>
                        <ul>
                            <li><span>Usuario: ${user.username}</span></li>
                            <li><span>Correo Electrónico: ${user.email}</span></li>
                            <li><span>Teléfono: ${user.phone}</span></li>
                            <li><span>Sitio Web: ${user.website}</span></li>
                        </ul>
                    </div>
                    <div class="col-auto extraInformation-${user.id} d-none">
                        <h4>Dirección:</h4>
                        <ul>
                            <li><span>Calle: ${user.address.street}</span></li>
                            <li><span>Número: ${user.address.suite}</span></li>
                            <li><span>Ciudad: ${user.address.city}</span></li>
                            <li><span>Código Postal: ${user.address.zipcode}</span></li>
                            <li><span>Latitud: ${user.address.geo.lat}</span></li>
                            <li><span>Longitud: ${user.address.geo.lng}</span></li>
                        </ul>
                    </div>
                    <div class="col-auto extraInformation-${user.id} d-none p-4 mx-4">
                        <h4>Empresa:</h4>
                        <ul>
                            <li><span>Nombre: ${user.company.name}</span></li>
                            <li><span>Eslogan: ${user.company.catchPhrase}</span></li>
                            <li><span>Misión: ${user.company.bs}</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    });
}

async function searchUsers(name) {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users`);

        if (!response.ok)
            throw new Error('La respuesta de la red no fue ok');

        const data = await response.json();
        const users = [];

        data.forEach(user => {
            if (removeDiacritics(user.name).toLowerCase().includes(name))
                users.push(user);
        });

        if (users.length > 0) {
            displayResults(users);
        } else
            results.innerHTML = "No se encontraron resultados.";

    } catch (error) {
        console.error("Error:", error);
        results.innerHTML = "Se produjo un error. Por favor, inténtalo de nuevo más tarde.";
    }
}