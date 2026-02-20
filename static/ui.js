const uploadBox = document.getElementById("uploadBox");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const uploadPlaceholder = document.getElementById("uploadPlaceholder");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultBox = document.getElementById("resultBox");
const breedResult = document.getElementById("breedResult");
const scoreResult = document.getElementById("scoreResult");
const breedConfBar = document.getElementById("breedConfBar");
const bcsConfBar = document.getElementById("bcsConfBar");
const breedConf = document.getElementById("breedConf");
const bcsConf = document.getElementById("bcsConf");
const errorBox = document.getElementById("errorBox");
const errorMsg = document.getElementById("errorMsg");
const loadingOverlay = document.getElementById("loadingOverlay");

let selectedFile = null;

uploadBox.addEventListener("click", () => imageInput.click());

uploadBox.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadBox.classList.add("drag-over");
});

uploadBox.addEventListener("dragleave", () => {
    uploadBox.classList.remove("drag-over");
});

uploadBox.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadBox.classList.remove("drag-over");
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
        handleFile(file);
    }
});

imageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
});

function handleFile(file) {
    selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => {
        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        uploadPlaceholder.classList.add("hidden");
        analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
    resultBox.classList.add("hidden");
    errorBox.classList.add("hidden");
}

analyzeBtn.addEventListener("click", async () => {
    if (!selectedFile) {
        showError("Please upload an image first.");
        return;
    }

    loadingOverlay.classList.remove("hidden");
    resultBox.classList.add("hidden");
    errorBox.classList.add("hidden");
    analyzeBtn.disabled = true;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
        const response = await fetch("/api/predict", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.error || "Something went wrong.");
            return;
        }

        breedResult.textContent = data.breed.replace("_", " ");
        breedConfBar.style.width = data.breed_confidence + "%";
        breedConf.textContent = data.breed_confidence + "% confidence";

        const bcsLabel = data.bcs.charAt(0).toUpperCase() + data.bcs.slice(1);
        scoreResult.textContent = bcsLabel;
        scoreResult.className = "result-value bcs-" + data.bcs;
        bcsConfBar.style.width = data.bcs_confidence + "%";
        bcsConf.textContent = data.bcs_confidence + "% confidence";

        resultBox.classList.remove("hidden");
    } catch (err) {
        showError("Failed to connect to the server. Is the backend running?");
    } finally {
        loadingOverlay.classList.add("hidden");
        analyzeBtn.disabled = false;
    }
});

function showError(msg) {
    errorMsg.textContent = msg;
    errorBox.classList.remove("hidden");
    loadingOverlay.classList.add("hidden");
    analyzeBtn.disabled = false;
}
