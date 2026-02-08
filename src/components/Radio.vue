<script setup lang="ts">
import { watch, ref, onMounted } from "vue";
import { color } from "@/ts/themer";

const props = defineProps(["modelValue", "valueKey"]);
const emit = defineEmits(["update:modelValue"]);
const box = ref<HTMLElement | null>(null);

function updateStyle(value: string) {
  const style = box.value?.style;
  const col = value === props.valueKey ? color.value : null;

  style?.setProperty("border-color", col);
  style?.setProperty("background", col);
}

// using getter function to watch props, directly watch props.modelValue won't work
watch(() => props.modelValue, updateStyle);

function select() {
  emit("update:modelValue", props.valueKey);
}

onMounted(() => {
  updateStyle(props.modelValue);
});
</script>

<template>
  <div class="radio" @click="select" ref="box"></div>
</template>

<style scoped>
.radio {
  border: solid 2px;
  border-radius: 50%;

  transition:
    border-color 150ms ease-in-out,
    background 125ms ease-in-out;

  width: 30px;
  height: 30px;

  display: inline-block;
}

.radio:hover {
  cursor: pointer;
}
</style>
