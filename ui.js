const uploadBox = document.getElementById("uploadBox");
const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const analyzeBtn = document.getElementById("analyzeBtn");
const resultBox = document.getElementById("resultBox");
const breedResult = document.getElementById("breedResult");
const scoreResult = document.getElementById("scoreResult");

uploadBox.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.style.display = "block";
        }
        reader.readAsDataURL(file);
    }
});

analyzeBtn.addEventListener("click", () => {
    if (!previewImage.src) {
        alert("Please upload an image first.");
        return;
    }

    // Mock AI Results
    const breeds = ["Holstein Friesian", "Jersey", "Angus", "Hereford"];
    const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
    const randomScore = (Math.random() * (5 - 2) + 2).toFixed(1);

    breedResult.textContent = randomBreed;
    scoreResult.textContent = randomScore;

    resultBox.style.display = "block";
});