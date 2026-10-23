
<template>
  <nav class="navigation">
    <RouterLink to="/">Add Book</RouterLink>
    <RouterLink to="/WeatherCheck">Get Weather</RouterLink>
    <RouterLink to="/GetAllBookAPI">Get All Books API</RouterLink>
  </nav>

  <RouterView />
</template>

<style scoped>
.navigation {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 20px;
  background: #183c70;
}

.navigation a {
  color: white;
  font-weight: bold;
  text-decoration: none;
}

.navigation a.router-link-active {
  text-decoration: underline;
}

</style>
