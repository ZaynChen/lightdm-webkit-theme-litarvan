<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { settings } from "@/ts/settings";
import { background } from "@/ts/themer";

const router = useRouter();

const fixed = computed(() => settings.blur !== "absolute");
const absolute = computed(() => settings.blur === "absolute");
const transition = computed(() => settings.blur !== "static");
const blurrable = computed(() => settings.blur !== "disabled");

function isBlurred() {
  let name = router.currentRoute.value.name;
  return name === "/base/login" || name === "/base/select_[mode]";
}

onMounted(() => {
  if (greeter_comm) {
    window.addEventListener("GreeterBroadcastEvent", ((
      event: CustomEvent<{ type: string; path: string }>,
    ) => {
      const data = event.detail;
      if (data.type == "change-background") {
        background.value = data.path;
      }
    }) as EventListener);
  }
});
</script>

<template>
  <div class="base">
    <div
      class="bg"
      :class="{ blurred: isBlurred(), fixed, absolute, blurrable, transition }"
      :style="{ 'background-image': 'url(' + background + ')' }"
    ></div>

    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.bg {
  background-size: cover;
  left: 0;
  right: 0;

  display: block;
  width: 100%;
  height: 100vh;

  z-index: -1;

  color: var(--secondary-color);

  &.absolute {
    position: absolute;
  }

  &.fixed {
    position: fixed;
  }

  &.blurrable {
    filter: blur(0px);

    &.transition {
      transition: filter 500ms ease-in-out;
    }

    &.blurred {
      filter: blur(10px);
    }
  }
}
</style>
