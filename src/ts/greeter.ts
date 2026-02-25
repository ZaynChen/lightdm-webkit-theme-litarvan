import * as mock from "./mock";

import type { User, Session } from "@/webkit-greeter";

if (globalThis.greeter === undefined) {
  console.log(" --> Theme is running outside greeter, using placeholder data");
  globalThis.greeter = mock.greeter;
  globalThis.greeter_config = mock.greeter_config;
  globalThis.greeter_comm = mock.greeter_comm;
  globalThis.theme_utils = mock.theme_utils;
}

console.log(" --> greeter provided data :");
console.log(globalThis.greeter);

import { reactive, ref, watch } from "vue";

const users = reactive(greeter.users ?? []);
const sessions = reactive(greeter.sessions ?? []);

function loadStorage(key: string) {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : undefined;
}

const lastSession = ref(loadStorage("lastSession") as Session | undefined);
watch(lastSession, (lastSession) => {
  lastSession &&
    localStorage.setItem("lastSession", JSON.stringify(lastSession));
});
lastSession.value =
  sessions.find((s) => s.key === lastSession.value?.key) ?? sessions[0];

const lastUser = ref(loadStorage("lastUser") as User | undefined);
const loginState = reactive({ sessionCreated: false, password: "" });
watch(lastUser, (lastUser) => {
  cancelSession();
  lastUser && localStorage.setItem("lastUser", JSON.stringify(lastUser));
});
lastUser.value =
  users.find((u) => u.username === lastUser.value?.username) ?? users[0];

function connect_show_prompt(callback: (text: string, type: string) => void) {
  greeter.show_prompt.connect(callback);
}

function disconnect_show_prompt(
  callback: (text: string, type: string) => void,
) {
  greeter.show_prompt.disconnect(callback);
}

function connect_show_message(callback: (text: string, type: string) => void) {
  greeter.show_message.connect(callback);
}

function disconnect_show_message(
  callback: (text: string, type: string) => void,
) {
  greeter.show_message.disconnect(callback);
}

function connect_authentication_complete(callback: () => void) {
  greeter.authentication_complete.connect(callback);
}

function disconnect_authentication_complete(callback: () => void) {
  greeter.authentication_complete.disconnect(callback);
}

function createSession() {
  // console.log("createSession");
  loginState.sessionCreated ||=
    greeter.authenticate(lastUser.value?.username ?? "") ?? false;
}

function cancelSession() {
  if (loginState.sessionCreated) {
    // console.log("cancelSession");
    greeter.cancel_authentication();
    loginState.password = "";
    loginState.sessionCreated = false;
  }
}

function postPassword() {
  // console.log("respond");
  return (
    loginState.sessionCreated && (greeter.respond(loginState.password) ?? false)
  );
}

function startSession() {
  // console.log("startSession");
  loginState.sessionCreated &&
    greeter.start_session(lastSession.value?.key ?? "");
}

export {
  cancelSession,
  connect_authentication_complete,
  connect_show_message,
  connect_show_prompt,
  createSession,
  disconnect_authentication_complete,
  disconnect_show_message,
  disconnect_show_prompt,
  lastSession,
  lastUser,
  loginState,
  postPassword,
  sessions,
  startSession,
  users,
};
