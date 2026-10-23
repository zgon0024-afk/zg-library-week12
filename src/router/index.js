
import { createRouter, createWebHistory } from "vue-router";

import AddBookView from "../views/AddBookView.vue";
import WeatherView from "../views/WeatherView.vue";
import GetAllBookAPI from "../views/GetAllBookAPI.vue";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      name: "AddBook",
      component: AddBookView
    },
    {
      path: "/WeatherCheck",
      alias: "/GetWeather",
      name: "GetWeather",
      component: WeatherView
    },
    {
      path: "/GetAllBookAPI",
      name: "GetAllBookAPI",
      component: GetAllBookAPI
    }
  ]
});

export default router;
