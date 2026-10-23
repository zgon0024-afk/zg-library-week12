
<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

const city = ref("Clayton,AU");
const weatherData = ref(null);
const loading = ref(false);
const errorMessage = ref("");
const source = ref("");

const temperature = computed(() =>
  weatherData.value
    ? weatherData.value.main.temp.toFixed(1)
    : null
);

const iconUrl = computed(() => {
  const icon = weatherData.value?.weather?.[0]?.icon;
  return icon
    ? `https://openweathermap.org/img/wn/${icon}@2x.png`
    : "";
});

async function fetchWeather(params, label) {
  if (!apiKey) {
    errorMessage.value = "OpenWeather API key is missing.";
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  weatherData.value = null;

  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          ...params,
          appid: apiKey,
          units: "metric"
        }
      }
    );

    weatherData.value = response.data;
    source.value = label;
  } catch (error) {
    const status = error.response?.status;

    if (status === 401) {
      errorMessage.value =
        "Invalid or inactive API key. Check OpenWeather.";
    } else if (status === 404) {
      errorMessage.value = "City not found.";
    } else {
      errorMessage.value =
        "Weather request failed: " + error.message;
    }
  } finally {
    loading.value = false;
  }
}

function searchByCity() {
  const query = city.value.trim();
  if (!query) return;

  fetchWeather({ q: query }, "City search");
}

function fetchCurrentLocationWeather() {
  if (!navigator.geolocation) {
    errorMessage.value = "Geolocation is not supported.";
    return;
  }

  errorMessage.value = "Requesting location permission...";

  navigator.geolocation.getCurrentPosition(
    (position) => {
      fetchWeather(
        {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        },
        "Current location"
      );
    },
    (error) => {
      errorMessage.value =
        "Location unavailable: " + error.message;
    },
    { timeout: 10000 }
  );
}

onMounted(() => {
  fetchCurrentLocationWeather();
});
</script>

<template>
  <main class="weather-page">
    <h1>FIT5032 Weather API</h1>
    <p>Week 10 - External API Integration</p>

    <section class="search-area">
      <h2>Search Weather by City</h2>

      <form @submit.prevent="searchByCity">
        <input
          v-model="city"
          type="text"
          placeholder="Enter city, e.g. Clayton,AU"
          required
        />

        <button type="submit">Search</button>
      </form>

      <button class="location-btn"
              @click="fetchCurrentLocationWeather">
        Get Current Location Weather
      </button>
    </section>

    <p v-if="loading">Loading weather data...</p>

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>

    <section v-if="weatherData" class="weather-result">
      <p class="source">{{ source }}</p>

      <h2>
        {{ weatherData.name }},
        {{ weatherData.sys.country }}
      </h2>

      <img
        v-if="iconUrl"
        :src="iconUrl"
        alt="Weather Icon"
      />

      <h1>{{ temperature }} °C</h1>

      <p>
        {{ weatherData.weather[0].description }}
      </p>

      <p>
        Humidity: {{ weatherData.main.humidity }}%
      </p>
    </section>
  </main>
</template>

<style scoped>
.weather-page {
  max-width: 700px;
  margin: 40px auto;
  padding: 32px;
  background: white;
  border-radius: 12px;
  text-align: center;
}

h1 {
  color: #222;
}

.search-area {
  margin-top: 25px;
}

input {
  width: 65%;
  padding: 12px;
  border: 1px solid #aaa;
  border-radius: 5px;
}

button {
  padding: 12px 18px;
  margin: 8px;
  border: none;
  border-radius: 6px;
  background: #1769cf;
  color: white;
  cursor: pointer;
}

.location-btn {
  background: #444;
}

.weather-result {
  margin-top: 25px;
  padding: 20px;
  border-radius: 12px;
  background: #eef6ff;
}

.weather-result h1 {
  font-size: 42px;
}

.source {
  color: #555;
}

.error {
  color: #c62828;
}
</style>
