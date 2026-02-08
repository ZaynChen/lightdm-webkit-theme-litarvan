<script setup lang="ts">
import LClock from "@/components/Clock.vue";
import LAdditions from "@/components/Additions.vue";
import { onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { settings } from "@/ts/settings";
import { trans } from "@/ts/translations";

const router = useRouter();

let isSecondary = document.head.dataset.wintype === "secondary";

const trigger = trans("trigger");
const clockOnly = settings.disableSplashText || isSecondary;
const showClock = !isSecondary;
const showAdditions = !isSecondary && !clockOnly;
const showTrigger = !clockOnly;

function keyup(event: KeyboardEvent) {
  if (event.key === "Enter" || event.key === " ") {
    router.push("/base/login");
  }
}

function authSuccess() {
  router.push(settings.disableFade ? "/base" : "/base/login");
}

onMounted(() => {
  if (isSecondary) {
    greeter?.authentication_complete?.connect(authSuccess);
  } else {
    window.addEventListener("keyup", keyup);
  }
});

onBeforeUnmount(() => {
  if (isSecondary) {
    greeter?.authentication_complete?.disconnect(authSuccess);
  } else {
    window.removeEventListener("keyup", keyup);
  }
});
</script>

<template>
  <div id="splash" :class="{ 'clock-only': clockOnly }">
    <div id="top-container">
      <LClock v-if="showClock" />
      <LAdditions v-if="showAdditions" />
    </div>
    <div v-if="showTrigger" id="trigger" v-italic>
      {{ trigger }}
    </div>
  </div>
</template>

<style scoped>
#splash {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

#splash:not(.clock-only) .clock {
  margin-top: 6vh;
}

#splash.clock-only {
  align-items: center;
  justify-content: center;
  flex-direction: initial;

  .clock {
    padding-bottom: 25px;
    /* Text size compensation */
  }
}

#top-container {
  display: flex;
  flex-direction: column;
}

#trigger {
  font-family: "Lato", "Noto Sans", serif;
  font-weight: 300;
  font-size: 32px;
  cursor: default;

  margin-bottom: 11.5vh;
  letter-spacing: 0.25px;
}
</style>
