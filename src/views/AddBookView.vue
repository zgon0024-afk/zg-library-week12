
<script setup>
import { ref, onUnmounted } from "vue";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot
} from "firebase/firestore";

import db, { auth } from "../Firebase/init";

const user = ref(null);
const isbn = ref("");
const name = ref("");
const author = ref("");
const savedBook = ref(null);
const message = ref("");
const loading = ref(false);

const stopAuth = onAuthStateChanged(auth, (u) => {
  user.value = u;
});
let stopBook = () => {};

onUnmounted(() => {
  stopAuth();
  stopBook();
});

async function login() {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (error) {
    message.value = error.message;
  }
}

async function addBook() {
  const bookIsbn = Number(isbn.value);

  if (!Number.isInteger(bookIsbn) || bookIsbn <= 0) {
    message.value = "Please enter a valid ISBN number.";
    return;
  }

  loading.value = true;
  message.value = "";
  savedBook.value = null;

  try {
    const result = await addDoc(collection(db, "books"), {
      isbn: bookIsbn,
      name: name.value.trim(),
      author: author.value.trim()
    });

    message.value = "Book added! Waiting for Cloud Function.";

    stopBook();
    stopBook = onSnapshot(
      doc(db, "books", result.id),
      (snapshot) => {
        if (snapshot.exists()) {
          savedBook.value = snapshot.data();
        }
      },
      (error) => {
        message.value = error.message;
      }
    );

    isbn.value = "";
    name.value = "";
    author.value = "";
  } catch (error) {
    message.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="container">
    <h1>FIT5032 Library System</h1>
    <p>Firestore & Cloud Functions - Task 9.2</p>

    <div v-if="!user">
      <button @click="login">Sign in with Google</button>
    </div>

    <div v-else>
      <p>Signed in: {{ user.email }}</p>
      <p><strong>Your UID:</strong> {{ user.uid }}</p>
      <button @click="signOut(auth)">Sign out</button>

      <h2>Add a New Book</h2>

      <form @submit.prevent="addBook">
        <label>ISBN</label>
        <input v-model="isbn" type="number" required />

        <label>Book Name</label>
        <input v-model="name" required />

        <label>Author</label>
        <input v-model="author" required />

        <button type="submit" :disabled="loading">
          {{ loading ? "Saving..." : "Add Book" }}
        </button>
      </form>
    </div>

    <p>{{ message }}</p>

    <section v-if="savedBook" class="result">
      <h2>Firestore Result</h2>
      <p><strong>ISBN:</strong> {{ savedBook.isbn }}</p>
      <p><strong>Name:</strong> {{ savedBook.name }}</p>
      <p><strong>Author:</strong> {{ savedBook.author }}</p>
    </section>
  </main>
</template>

<style scoped>
.container {
  max-width: 650px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  color: #222222;
  border-radius: 12px;
  font-family: Arial, sans-serif;
}

label {
  display: block;
  margin-top: 15px;
}

input {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  margin-top: 6px;
}

button {
  margin-top: 20px;
  padding: 12px 20px;
  background: #1666cc;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.result {
  margin-top: 25px;
  padding: 20px;
  background: #eef6ff;
  border-radius: 8px;
}
</style>
