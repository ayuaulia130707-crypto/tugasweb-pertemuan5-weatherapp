const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const getWeather = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${currentUnit}&lang=id`;

    let response;

try {
    response = await fetch(url);
} catch (error) {
    throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet.");
}
const data = await response.json();

if (response.status === 404) {
    throw new Error("Kota tidak ditemukan.");
}

return data;
};
const weatherForm = document.querySelector("#weatherForm");
const cityInput = document.querySelector("#cityInput");
const loading = document.querySelector("#loading");
const error = document.querySelector("#error");
const weatherWarning = document.querySelector("#weatherWarning");
const historyList = document.querySelector("#historyList");
const unitToggle = document.querySelector("#unitToggle");
const clearHistory = document.querySelector("#clearHistory");
let currentUnit = "metric";
const showHistory = () => {
    clearHistory.addEventListener("click", () => {
    const confirmDelete = confirm("Yakin ingin menghapus semua riwayat pencarian?");

    if (confirmDelete) {
        localStorage.removeItem("weatherHistory");
        showHistory();
    }
});
    const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    historyList.innerHTML = "";

    history.map((city) => {
        const listItem = document.createElement("li");
        listItem.textContent = city;

        listItem.addEventListener("click", () => {
            cityInput.value = city;
            weatherForm.dispatchEvent(new Event("submit"));
        });

        historyList.appendChild(listItem);
    });
};

showHistory();
weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

if (!city) {
    return;
}

loading.textContent = "⏳ Memuat data cuaca...";
error.textContent = "";

try {
    const data = await getWeather(city);

    const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

if (!history.includes(data.name)) {
    history.unshift(data.name);
}

localStorage.setItem("weatherHistory", JSON.stringify(history));

showHistory();

    loading.textContent = "";

    const weatherDescription = data.weather
    .map((item) => item.description)
    .join(", ");
    const weatherId = data.weather[0].id;

weatherWarning.className = "";

if (weatherId >= 200 && weatherId < 300) {
    weatherWarning.classList.add("warning-danger");
    weatherWarning.textContent = "⛈️ Peringatan: Waspada, terdapat kondisi petir atau badai.";
} else if (weatherId >= 502 && weatherId < 505) {
    weatherWarning.classList.add("warning-heavy-rain");
    weatherWarning.textContent = "🌧️ Peringatan: Hujan lebat. Hati-hati saat beraktivitas di luar.";
} else if (weatherId >= 500 && weatherId < 600) {
    weatherWarning.classList.add("warning-rain");
    weatherWarning.textContent = "🌧️ Peringatan: Sedang terjadi hujan. Waspadai kondisi jalan yang basah.";
} else if (weatherId >= 600 && weatherId < 700) {
    weatherWarning.classList.add("warning-cold");
    weatherWarning.textContent = "❄️ Peringatan: Kondisi cuaca dingin atau bersalju.";
} else {
    weatherWarning.classList.add("warning-good");
    weatherWarning.textContent = "✅ Kondisi cuaca saat ini relatif baik.";
}

const cityName = document.querySelector("#cityName");
const weatherDate = document.querySelector("#weatherDate");
const weatherIcon = document.querySelector("#weatherIcon");
const temperature = document.querySelector("#temperature");
const description = document.querySelector("#description");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#windSpeed");
const pressure = document.querySelector("#pressure");

cityName.textContent = data.name;
weatherDate.textContent = "Informasi cuaca saat ini";
weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
weatherIcon.alt = data.weather[0].description;
temperature.textContent = `${data.main.temp} °${currentUnit === "metric" ? "C" : "F"}`;
description.textContent = weatherDescription;
humidity.textContent = `${data.main.humidity}%`;
windSpeed.textContent = `${data.wind.speed} m/s`;
pressure.textContent = `${data.main.pressure} hPa`;
} catch (err) {
    loading.textContent = "";
    error.textContent = err.message;
}
});
unitToggle.addEventListener("click", () => {
    currentUnit = currentUnit === "metric" ? "imperial" : "metric";

    unitToggle.textContent = currentUnit === "metric" ? "°C / °F" : "°F / °C";

    const city = cityInput.value.trim();

    if (city) {
        weatherForm.dispatchEvent(new Event("submit"));
    }
});