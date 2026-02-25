<script setup lang="ts">
import LPowerButton from "@/components/PowerButton.vue";
import LClock from "@/components/Clock.vue";
import LSelectItem from "@/components/SelectItem.vue";
import LAdditions from "@/components/Additions.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { avatar, settings } from "@/ts/settings";
import { trans } from "@/ts/translations";
import {
  lastUser,
  lastSession,
  loginState,
  createSession,
  cancelSession,
  postPassword,
  startSession,
  connect_authentication_complete,
  disconnect_authentication_complete,
  connect_show_message,
  disconnect_show_message,
  connect_show_prompt,
  disconnect_show_prompt,
} from "@/ts/greeter";

const props = defineProps(["immutable", "compact", "preview"]);

const router = useRouter();

const canHibernate = greeter.can_hibernate;
const canSuspend = greeter.can_suspend;
const passwordLabel = trans("password");
const isCompact = props.immutable ? props.compact : settings.mode === "compact";
const powerList = ref(false);
const logging = ref(false);
const error = ref(false);
const info = ref("");
const message = ref("");

function select(mode: string) {
  if (!props.immutable) {
    router.push(`/base/select_${mode}`);
  }
}

function submit() {
  logging.value = true;
  error.value = false;
  message.value = "";

  setTimeout(() => {
    if (!postPassword()) {
      logging.value = false;
      error.value = true;
      const text = "Failed to submit password";
      if (message.value === "") {
        message.value = text;
      } else {
        message.value = `${message.value} ${text}`;
      }
    }
  }, 150);
}

function show_prompt(text: string, _type: string) {
  // console.log("show_prompt: " + text + ", " + _type);
  logging.value = text !== "Password: ";
}

function show_message(text: string, type: string) {
  // console.log("show_message: " + type + ", " + text);
  error.value = true;
  logging.value = false;
  if (type !== "Info") {
    // the login session is already cancelled, so we don't neet to cancel
    // the session except update the session state.
    loginState.sessionCreated = false;
    loginState.password = "";
    createSession();
  }
  if (message.value === "") {
    message.value = text;
  } else {
    message.value = `${message.value} ${text}`;
  }
}

function authentication_complete() {
  if (greeter.is_authenticated) {
    setTimeout(startSession, 400);
    router.push(settings.disableFade ? "/base" : "/intro/login");
  } else if (document.head.dataset.wintype === "primary") {
    cancelSession();
    error.value = true;
    logging.value = false;
    createSession();
  }
}

function keyup(event: KeyboardEvent) {
  if (event.key === "CapsLock") {
    info.value = trans("capsLock");
  } else if (event.key === "Enter") {
    event.stopPropagation();
  } else {
    info.value = "";
  }
}

onMounted(() => {
  window.addEventListener("keyup", keyup);
  connect_show_prompt(show_prompt);
  connect_show_message(show_message);
  connect_authentication_complete(authentication_complete);

  if (!props.preview) {
    cancelSession(); // cancel any old sessions
    createSession(); // begin a new login session to get any messages
  }

  setTimeout(() => {
    document.querySelector<HTMLElement>("#password")?.focus();
  }, 650);
});

onBeforeUnmount(() => {
  disconnect_show_prompt(show_prompt);
  disconnect_show_message(show_message);
  disconnect_authentication_complete(authentication_complete);
  window.removeEventListener("keyup", keyup);
});
</script>

<template>
  <div class="login" :class="{ compact: isCompact }">
    <div id="top-container" v-if="isCompact">
      <LClock :small="true" />
      <LAdditions :small="true" :preview="preview" />
    </div>

    <div id="login-content" :class="{ 'no-avatar': settings.disableAvatar }">
      <div id="avatar" v-if="!settings.disableAvatar">
        <img
          id="avatar-image"
          :class="{ round: settings.roundAvatar }"
          :src="avatar(lastUser?.image)"
        />
      </div>

      <div id="login-form">
        <LSelectItem
          mode="user"
          :item="lastUser"
          @select="select('user')"
          :noicon="true"
        />

        <form v-if="!immutable" @submit.prevent="submit">
          <input
            id="password"
            type="password"
            v-model="loginState.password"
            :placeholder="passwordLabel"
            :readonly="logging"
            :class="{ error: error }"
            v-theming="['border-bottom-color']"
            v-italic.custom
          />
        </form>
        <div v-else id="password" class="immutable"></div>
        <div id="info" v-italic>
          {{ info }}
        </div>

        <div v-if="!isCompact" class="error-msg">
          {{ message }}
        </div>

        <LSelectItem
          mode="desktop"
          :item="lastSession"
          @select="select('desktop')"
        />
      </div>
      <div v-if="isCompact" class="error-msg">
        {{ message }}
      </div>
    </div>

    <div v-if="!immutable">
      <LPowerButton id="settings" type="settings"></LPowerButton>

      <transition name="power-fade">
        <div id="power-list" v-if="powerList">
          <LPowerButton
            v-if="canHibernate"
            id="hibernate"
            type="hibernate"
          ></LPowerButton>
          <LPowerButton
            v-if="canSuspend"
            id="suspend"
            type="suspend"
          ></LPowerButton>
          <LPowerButton id="reboot" type="restart"></LPowerButton>
        </div>
      </transition>

      <div @click="powerList = !powerList">
        <LPowerButton
          id="shutdown"
          type="shutdown"
          :disabled="!powerList"
        ></LPowerButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login.compact {
  .clock {
    margin-top: 6vh;
  }

  #avatar,
  #login-form {
    display: inline-block;
  }

  #avatar {
    margin-top: 0;
  }

  #login-form {
    text-align: left;
    margin-left: 42px;
    margin-top: 31px;
  }

  .item.user {
    margin-bottom: 0;
  }

  #login-content {
    margin-top: 10.5vh;
  }

  @media (min-height: 900px) {
    #login-content {
      margin-top: 14.25vh;
    }
  }

  #login-content.no-avatar {
    .item.user {
      margin-bottom: 2vh;
    }

    .item.desktop {
      margin-top: 4vh;
    }

    #login-form {
      margin-left: 0;
      text-align: center;
    }
  }

  .item.user {
    margin-top: 0;
  }

  #password {
    margin-top: 2.5vh;
  }

  #info {
    font-size: 17px;
    height: 26px;
    margin-top: 5px;
  }

  .error-msg {
    font-size: 17px;
    height: 26px;
    margin-top: 5px;
  }

  .item.desktop {
    margin-top: 0;
  }
}

#top-container {
  display: flex;
  flex-direction: column;
}

.item.user {
  margin-bottom: 13px;
}

#login-content {
  margin-top: 11.5vh;
}

@media (min-height: 850px) {
  #login-content {
    margin-top: 14vh;
  }
}

#login-content.no-avatar {
  margin-top: calc(50vh - 165px);

  .item.user {
    margin-top: 0;
  }

  .item.desktop {
    margin-top: calc(5.5vh - 46px);
  }
}

#avatar-image {
  height: 200px;
}

.round {
  border-radius: 100px;
}

.item.user {
  margin-top: 3.5vh;
}

#password {
  font-weight: 300;
}

#password,
#password:focus {
  outline: none;
}

#password::placeholder {
  color: rgba(var(--secondary-color), 0.55);
  opacity: 1;
}

#password.italic::placeholder {
  font-style: italic;
}

#password {
  margin-top: 4.5vh;

  font-family: "Lato", "Noto Sans", sans-serif;

  background: var(--password-field-background);
  caret-color: var(--password-field-caret);
  color: var(--secondary-color);

  padding-left: 15px;
  padding-right: 15px;
  font-size: 24px;

  width: 400px;
  height: 54px;

  border: none;
  border-bottom: solid 3px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

#password.error {
  border-bottom-color: var(--error-color) !important;
}

#password.immutable {
  display: inline-block;
  background: var(--password-field-background-setup);
  border-bottom-width: 6px;
}

#info {
  color: rgba(255, 255, 255, 0.875);

  font-family: "Lato", "Noto Sans", sans-serif;
  font-size: 22px;
  font-weight: 300;

  text-align: center;

  margin-top: 15px;
  height: 31px;
}

.error-msg {
  color: var(--error-color);

  font-family: "Lato", "Noto Sans", sans-serif;
  font-size: 22px;

  text-align: center;

  margin-top: 15px;
  height: 31px;
}

.item.desktop {
  margin-top: calc(6vh - 46px);
  display: inline-block;
}

.item.user {
  display: inline-block;
}

#settings {
  position: absolute;
  bottom: 20px;
  left: 20px;
}

#hibernate {
  position: absolute;
  bottom: 245px;
  right: 20px;
}

#suspend {
  position: absolute;
  bottom: 170px;
  right: 20px;
}

#reboot {
  position: absolute;
  bottom: 95px;
  right: 20px;
}

#shutdown {
  position: absolute;
  bottom: 20px;
  right: 20px;
}

@media (max-height: 850px) {
  #password {
    height: 49px;
    font-size: 22px;
  }
}

.power-fade-enter-active {
  transition: all 0.3s ease;
}

.power-fade-enter {
  opacity: 0;
}
</style>
