<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { settings, state } from "@/ts/settings";
import { trans } from "@/ts/translations";

const router = useRouter();

const show = ref(false);
const text = computed(() => {
  return trans(state.value);
});

onMounted(() => {
  if (state.value === "initial") {
    // TODO: secondary.html, necessary?
    if (document.head.dataset.wintype === "secondary") {
      if (settings.disableIntro) {
        router.push("/base/splash");
      } else {
        setTimeout(() => {
          router.push("/base/splash");
        }, 2000);
      }
      return;
    }

    if (settings.disableIntro) {
      router.push(settings.disableSplash ? "/base/login" : "/base/splash");
      return;
    }
  }

  show.value = true;
  setTimeout(() => {
    show.value = false;
    router.push(
      settings.first
        ? "/setup"
        : settings.disableSplash
          ? "/base/login"
          : "/base/splash",
    );
  }, 2000);
});

// vite static assets handling
function getImageUrl(filename: string) {
  return new URL(`../assets/images/${filename}`, import.meta.url).href;
}
</script>

<template>
  <div id="intro">
    <transition name="logo-fade">
      <div id="content" v-if="show">
        <img
          v-if="state === 'initial'"
          id="logo"
          :src="getImageUrl('os.png')"
        />
        <p v-else id="power-text" v-italic>
          <img id="power-icon" :src="getImageUrl(`${state}.svg`)" />
          {{ text }}
        </p>
      </div>
    </transition>
  </div>
</template>

<style scoped>
#intro {
  background-color: var(--outer-background);

  display: flex;
  align-items: center;
  text-align: center;
}

#content {
  margin-left: auto;
  margin-right: auto;
}

#logo {
  height: 250px;
}

#power-text {
  font-family: "Lato", "Noto Sans", serif;
  font-weight: normal;
  color: var(--outer-foreground);
  font-size: 58px;
}

.logo-fade-enter-active,
.logo-fade-leave-active {
  transition: opacity 1s;
}

.logo-fade-enter,
.logo-fade-leave-to {
  opacity: 0;
}

#power-icon {
  width: 50px;

  margin-bottom: -5px;
  margin-right: 4px;
}
</style>
