<script setup lang="ts">
import { useRouter } from "vue-router";
import { settings, state } from "@/ts/settings";

const router = useRouter();

// const types = ['shutdown', 'hibernate', 'suspend', 'restart', 'settings', 'back']
const props = defineProps(["type", "disabled"]);

function apply() {
  if (props.type === "back") {
    router.back();
    return;
  }

  if (props.type === "settings") {
    router.push("/setup");
    return;
  }

  if (props.type === "theming") {
    router.push("/theming");
    return;
  }

  let action;
  switch (props.type) {
    case "restart":
      action = greeter.restart;
      break;
    case "hibernate":
      action = greeter.hibernate;
      break;
    case "suspend":
      action = greeter.suspend;
      break;
    case "shutdown":
      action = greeter.shutdown;
      break;
  }
  action ??= () => console.log(`invoke action: ${props.type}`);
  if (settings.disablePowerTexts) {
    action();
    return;
  }
  setTimeout(() => action(), 1500);

  state.value = props.type;
  router.push("/");
}

function icon() {
  return new URL(`../assets/images/${props.type}.svg`, import.meta.url).href;
}
</script>

<template>
  <div class="power-button">
    <div id="button-container" @click="disabled ? '' : apply()">
      <img id="power-button-icon" :class="{ type }" :src="icon()" />
    </div>
  </div>
</template>

<style scoped>
#button-container {
  transition: background 125ms ease-in-out;
  border-radius: 6px;
  line-height: 1;
}

#button-container:hover {
  background: rgba(255, 255, 255, 0.08);
  cursor: pointer;
}

#power-button-icon {
  box-sizing: initial;

  padding: 10px 10px 10px;

  width: 42px;
  height: 42px;
}
</style>
