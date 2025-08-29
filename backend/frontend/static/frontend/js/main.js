"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const apiUrl = "http://127.0.0.1:8000/api/candidates/";
function getCookie(name) {
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
function fetchCandidates() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(apiUrl);
        const data = yield res.json();
        renderTable(data);
    });
}
function renderTable(candidates) {
    const tbody = document.querySelector("#candidates-table tbody");
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
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(`${apiUrl}?search=${searchInput.value}`);
    const data = yield res.json();
    renderTable(data);
}));
const csrftoken = getCookie("csrftoken");
const form = document.getElementById("candidate-form");
form.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", document.getElementById("name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("skills", document.getElementById("skills").value);
    const fileInput = document.getElementById("cv");
    if ((_a = fileInput.files) === null || _a === void 0 ? void 0 : _a.length) {
        formData.append("cv", fileInput.files[0]);
    }
    yield fetch(apiUrl, {
        method: "POST",
        body: formData,
        headers: {
            "X-CSRFToken": csrftoken || ""
        },
    });
    form.reset();
    fetchCandidates();
}));
fetchCandidates();
