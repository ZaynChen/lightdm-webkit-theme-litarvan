import "./css/base.css";
import "./ts/greeter";
import { hook } from "./ts/themer";
import italicHook from "./ts/italic";

import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.directive("theming", {
  beforeMount(el, { value }) {
    hook(el, value);
  },
});

app.directive("italic", {
  beforeMount(el, { modifiers }) {
    italicHook(el, modifiers.custom);
  },
  updated(el, { modifiers }) {
    italicHook(el, modifiers.custom);
  },
});

app.use(router);
app.mount("#app");
