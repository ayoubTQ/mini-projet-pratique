const apiUrl = "http://127.0.0.1:8000/api/candidates/";

function getCookie(name: string) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

async function fetchCandidates() {
    const res = await fetch(apiUrl);
    const data = await res.json();
    renderTable(data);
}

function renderTable(candidates: any[]) {
    const tbody = document.querySelector("#candidates-table tbody")!;
    tbody.innerHTML = "";
    candidates.forEach(c => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${c.name}</td>
            <td>${c.email}</td>
            <td>${c.skills}</td>
            <td><a href="${c.cv}" target="_blank">Voir CV</a></td>
        `;
        tbody.appendChild(row);
    });
}


const searchInput = document.getElementById("search") as HTMLInputElement;
searchInput.addEventListener("input", async () => {
    const res = await fetch(`${apiUrl}?search=${searchInput.value}`);
    const data = await res.json();
    renderTable(data);
});


const csrftoken = getCookie("csrftoken");
const form = document.getElementById("candidate-form") as HTMLFormElement;
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
        formData.append("name", (document.getElementById("name") as HTMLInputElement).value);
        formData.append("email", (document.getElementById("email") as HTMLInputElement).value);
        formData.append("skills", (document.getElementById("skills") as HTMLInputElement).value);

    const fileInput = document.getElementById("cv") as HTMLInputElement;
    if (fileInput.files?.length) {
       formData.append("cv", fileInput.files[0]);
    }

    await fetch(apiUrl, {
        method: "POST",
        body: formData,
        headers:{
        "X-CSRFToken": csrftoken || ""
        },
    });
    form.reset();
    fetchCandidates();
});

fetchCandidates();
