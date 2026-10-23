
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const jsondata = ref("Loading books...");
const errorMessage = ref("");

const getBookCountAPI = async () => {
  try {
    const response = await axios.get(
      "https://us-central1-fit5032-48f1a.cloudfunctions.net/getAllBooks"
    );

    jsondata.value = JSON.stringify(response.data, null, 2);
  } catch (error) {
    errorMessage.value = "Failed to fetch books: " + error.message;
  }
};

onMounted(() => {
  getBookCountAPI();
});
</script>

<template>
  <main class="api-page">
    <h1>GetAllBookAPI</h1>
    <p>FIT5032 Week 10 - JSON API</p>

    <p v-if="errorMessage" class="error">
      {{ errorMessage }}
    </p>

    <pre v-else>{{ jsondata }}</pre>
  </main>
</template>

<style scoped>
.api-page {
  max-width: 900px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
}

h1 {
  color: #222;
}

pre {
  background: #eef2f7;
  padding: 20px;
  border-radius: 8px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  text-align: left;
  font-size: 14px;
  line-height: 1.6;
}

.error {
  color: red;
}
</style>
