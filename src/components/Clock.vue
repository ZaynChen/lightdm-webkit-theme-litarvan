<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { getLocale } from "@/ts/translations";
import { settings } from "@/ts/settings";

const props = defineProps(["small"]);

const datetime = reactive({
  hour: "00",
  minute: "00",
  part: "",
  date: "",
});

function setTime() {
  const newdate = new Date();

  const [hour, minute, part] = newdate
    .toLocaleTimeString(getLocale(), {
      hour: "numeric",
      minute: "numeric",
      hour12: settings.clock12,
    })
    .split(/[:| ]/);
  datetime.hour = hour ?? "";
  datetime.minute = minute ?? "";
  datetime.part = part ?? "";

  datetime.date = newdate
    .toLocaleDateString(getLocale(), {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .split(" ")
    // Capitalize date
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(" ");
}

const interval = ref(0);

onMounted(() => {
  setTime();
  interval.value = setInterval(setTime, 1000);
});

onBeforeUnmount(() => {
  clearInterval(interval.value);
});
</script>

<template>
  <div class="clock" :class="{ small: small }">
    <span id="hours">{{ datetime.hour }}</span
    >:{{ datetime.minute }}<span id="part">{{ datetime.part }}</span>

    <div id="date">
      {{ datetime.date }}
    </div>
  </div>
</template>

<style scoped>
.clock {
  font-size: 164px;
  font-weight: 300;
  font-family: "Lato", "Noto Sans", sans-serif;
  line-height: 1.1;

  text-align: center;
  cursor: default;
}

.clock.small {
  font-size: 138px;

  #date {
    font-size: 24px;
    margin-top: 1.8vh;
  }
}

#hours {
  font-weight: normal;
}

#part {
  font-size: 18px;
  font-weight: normal;
}

#date {
  font-weight: normal;
  margin-top: 2.25vh;
  font-size: 28px;
  cursor: default;
}
</style>
