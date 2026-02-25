<script setup lang="ts">
import LCheckbox from "@/components/Checkbox.vue";
import LPowerButton from "@/components/PowerButton.vue";
import { onMounted, reactive, watch } from "vue";
import { settings } from "@/ts/settings";
import { bg, backgrounds, color, DEFAULT_COLOR } from "@/ts/themer";
import { trans } from "@/ts/translations";

const title = trans("theming");
const bgPath = greeter_config.branding.background_images_dir;
const bgAddLabel = trans("bgAdd");
const randomizeLabel = trans("randomizeBG");
const colorLabel = trans("primaryColor");

const rgb = reactive({
  r: 0,
  g: 0,
  b: 0,
  updateByHex(hex: string) {
    if (hex.length <= 7 && !hex.match(/^#?[A-f\d]{1,6}/)) {
      return;
    }

    let [r, g, b] = hex.match(/[A-f\d]{2}/g)?.map((s) => parseInt(s, 16)) ?? [];
    this.r = r ?? 0;
    this.g = g ?? 0;
    this.b = b ?? 0;
  },
  toHex() {
    function toh(n: number) {
      const hex = Math.min(255, Math.max(0, n)).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }
    return "#" + toh(this.r) + toh(this.g) + toh(this.b);
  },
});

onMounted(() => rgb.updateByHex(color.value));
// update rbg when color changes
watch(color, () => rgb.updateByHex(color.value));

function reset() {
  color.value = DEFAULT_COLOR;
}

function filterHex(ev: KeyboardEvent) {
  if (
    (color.value === "" && ev.key !== "#") ||
    (color.value === "#" && ev.key === "Backspace") ||
    !ev.key.match(/[A-f\d]/)
  ) {
    ev.preventDefault();
  }
}

function filterRGB(ev: KeyboardEvent) {
  if (ev.key !== "Backspace" && ev.key !== "Delete" && !ev.key.match(/\d/)) {
    ev.preventDefault();
  }

  color.value = rgb.toHex();
}

function nextBG() {
  bg.value = bg.value === backgrounds.length - 1 ? 0 : bg.value + 1;
}
function prevBG() {
  bg.value = bg.value === 0 ? backgrounds.length - 1 : bg.value - 1;
}

function getImageUrl(filename: string) {
  return new URL(`../assets/images/${filename}`, import.meta.url).href;
}
</script>

<template>
  <div id="theming-view">
    <h1 id="theming-title">{{ title }}</h1>

    <div id="theming-content">
      <div id="color-theming">
        <div id="colors">
          <div class="color">
            <span class="color-label">{{ colorLabel }}</span>
            <img
              class="color-reset"
              @click="reset()"
              :src="getImageUrl('restart.svg')"
            />
            <div>
              <span class="color-value" v-italic>{{ color }}</span>
              <div
                class="color-preview"
                :style="'background-color: ' + color + ';'"
              ></div>
            </div>
          </div>
        </div>
        <div id="color-picking">
          <div
            id="picking-preview"
            :style="'background-color: ' + color + ';'"
          ></div>
          <div id="picking-title" v-italic>{{ colorLabel }}</div>

          <div>
            <label for="picking-hex"
              >Hex :
              <input
                id="picking-hex"
                v-model="color"
                maxlength="7"
                @keydown="filterHex"
                v-italic
            /></label>
          </div>
          <div id="rgb">
            <label for="picking-r"
              >R :
              <input
                id="picking-r"
                v-model="rgb.r"
                maxlength="3"
                @keydown="filterRGB"
                v-italic
            /></label>
            <label for="picking-g"
              >G :
              <input
                id="picking-g"
                v-model="rgb.g"
                maxlength="3"
                @keydown="filterRGB"
                v-italic
            /></label>
            <label for="picking-b"
              >B :
              <input
                id="picking-b"
                v-model="rgb.b"
                maxlength="3"
                @keydown="filterRGB"
                v-italic
            /></label>
          </div>
        </div>
      </div>

      <div id="background-theming">
        <img id="background" :src="backgrounds[bg]" />
        <div id="background-switch">
          <img :src="getImageUrl('back.svg')" @click="prevBG" />
          <span class="background-label" v-italic>Background</span>
          <img :src="getImageUrl('next.svg')" @click="nextBG" />
        </div>

        <div id="random-check">
          <LCheckbox v-model="settings.randomizeBG" /><span
            class="background-label"
            v-italic
            >{{ randomizeLabel }}</span
          >
        </div>
      </div>
    </div>

    <div id="background-message" v-italic>{{ bgAddLabel }} {{ bgPath }}</div>

    <LPowerButton id="back" type="back" />
  </div>
</template>

<style scoped>
#theming-view {
  color: var(--outer-foreground);
  text-align: left;

  font-family: "Lato", "Noto Sans", sans-serif;

  padding: 35px;
  box-sizing: border-box;
}

#theming-title {
  font-size: 72px;
  font-weight: 300;
  margin: 0;

  margin-bottom: 15px;
}

#theming-content {
  display: flex;
  justify-content: space-between;

  width: 100%;
}

#color-theming {
  width: 50%;
  display: flex;
}

#colors {
  margin-top: 20px;
  margin-left: 20px;

  font-size: 24px;

  width: 50%;
}

.color {
  margin-top: 20px;
}

.color-label {
  cursor: default;
}

.color-reset {
  height: 25px;
  vertical-align: bottom;

  margin-left: 5px;

  &:hover {
    cursor: pointer;
  }
}

.color-value {
  margin-left: 15px;
  font-weight: 300;
}

.color-preview {
  display: inline-block;
  margin-left: 10px;

  border-radius: 50px;

  width: 15px;
  height: 15px;

  vertical-align: middle;
}

#color-picking {
  border-left: solid 1px #ffffffaa;

  padding-top: 35px;
  padding-left: 45px;

  box-sizing: border-box;

  width: 50%;

  label {
    font-size: 18px;
  }

  input {
    border: none;
    border-bottom: solid 1px #ffffffcc;

    color: var(--outer-foreground);
    background: none;

    margin-left: 8px;

    font-size: 18px;
    font-family: "Lato", "Noto Sans", sans-serif;
  }
}

#picking-preview {
  width: 100px;
  height: 100px;

  border-radius: 50%;
}

#picking-title {
  margin-top: 25px;

  font-size: 32px;
  font-weight: 300;
}

#picking-hex {
  margin-top: 30px;
}

#rgb {
  margin-top: 8px;

  input {
    width: 35px;
    margin-right: 15px;

    font-style: normal;
  }
}

#background-theming {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#background {
  max-width: 75%;
  max-height: calc(100vh - 375px);

  border-radius: 5px;

  border: solid 1px white;
}

.background-label {
  cursor: default;

  font-size: 28px;
  font-weight: 300;

  margin-top: 1px;
}

#background-switch {
  display: flex;
  justify-content: space-between;

  width: 75%;
  margin-top: 20px;

  align-items: center;

  img {
    height: 40px;

    padding: 10px;
    margin-left: 10px;
    margin-right: 10px;

    transition: background-color 125ms ease-in-out;

    border-radius: 4px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
      cursor: pointer;
    }
  }
}

#random-check {
  margin-top: 20px;

  .background-label {
    font-size: 24px;
  }

  .checkbox {
    margin-right: 17px;
    margin-bottom: -5px;

    width: 25px;
    height: 25px;
  }
}

#background-message {
  position: absolute;
  right: 40px;
  bottom: 35px;

  font-size: 28px;
  font-weight: 300;
}
</style>
