import { reactive, toRaw, watch, ref } from "vue";

const state = ref("initial");

function loadSettings() {
  let obj = JSON.parse(localStorage.getItem("settings") ?? "{}");
  obj.first ??= true;
  obj.mode ??= "classic";
  obj.blur ??= "fixed";

  obj.disableSplash ??= false;
  obj.disableSplashText ??= false;
  obj.disableIntro ??= false;
  obj.disableFade ??= false;
  obj.roundAvatar ??= false;
  obj.disableAvatar ??= false;
  obj.disableZoom ??= false;
  obj.clock12 ??= false;
  obj.disablePowerTexts ??= false;
  obj.randomizeBG ??= false;
  obj.hideUsername ??= false;

  return obj;
}

const settings = reactive(loadSettings());
watch(settings, () =>
  // save settings once settings changed, (autosaving)
  localStorage.setItem("settings", JSON.stringify(toRaw(settings))),
);

function avatar(avatar?: string | null) {
  if (avatar === "litarvan") {
    avatar = new URL("../assets/images/litarvan.png", import.meta.url).href;
  }
  avatar ||= new URL("../assets/images/default_user.png", import.meta.url).href;

  return avatar;
}

export { settings, avatar, state };

console.log(" --> Loaded settings :");
console.log(toRaw(settings));
