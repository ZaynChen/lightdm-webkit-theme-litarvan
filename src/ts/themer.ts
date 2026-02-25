import { reactive, ref, watch } from "vue";
import { settings } from "./settings";
import DEFAULT_BG from "../assets/images/background.png";

// Theme color
const DEFAULT_COLOR = "#249cea";
const color = ref(localStorage.getItem("color") ?? DEFAULT_COLOR);
watch(color, () => {
  // autosave color
  localStorage.setItem("color", color.value);
  document.documentElement.style.setProperty("--primary-color", color.value);
});
document.documentElement.style.setProperty("--primary-color", color.value);

function hook(element: HTMLElement, rules: string[]) {
  const style = element.style;
  for (const rule of rules) {
    style.setProperty(rule, color.value);
  }
}

// Background wallpaper
const bg = ref(0);
const background = ref(localStorage.getItem("background") ?? DEFAULT_BG);
const backgrounds = reactive([DEFAULT_BG, ...(await getBackgrounds())]);
watch(bg, (bg) => (background.value = backgrounds[bg] ?? background.value));
watch(background, (background) => {
  // autosave background
  localStorage.setItem("background", background);
  greeter_comm.broadcast({
    type: "change-background",
    path: background,
  });
});

if (settings.randomizeBG) {
  const rand_idx = Math.floor(Math.random() * backgrounds.length);
  if (backgrounds[rand_idx]) {
    bg.value = rand_idx;
    background.value = backgrounds[rand_idx];
  }
} else {
  const idx = backgrounds.findIndex((b: string) => b === background.value);
  if (idx > 0) {
    bg.value = idx;
  } else {
    bg.value = 0;
    background.value = backgrounds[0] ?? DEFAULT_BG;
  }
}

async function getBackgrounds() {
  const folder = greeter_config.branding.background_images_dir;

  if (!folder) {
    return [];
  }
  return await recDirList(folder);
}

async function recDirList(dir: string) {
  const result: string[] = [];

  // return list of abs paths for the files and directories found in path.
  const entries = (await theme_utils.dirlist(dir, false)) ?? [];
  for (const entry of entries) {
    // dirlist is a list of path string,
    // so no other info to use to distinguish file and dirs
    if (!entry.includes(".")) {
      // I didn't find any good ways to do it
      result.push(...(await recDirList(entry)));
    } else if (!entry.endsWith(".xml") && !entry.endsWith(".stw")) {
      // Gnome and Arch backgrounds have strange files
      result.push(entry);
    }
  }

  return result;
}

export { background, backgrounds, bg, color, DEFAULT_COLOR, hook };
