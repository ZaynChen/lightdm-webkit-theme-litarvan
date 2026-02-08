interface Language {
  code: string;
  name: string;
  territory: string;
}

interface Session {
  comment: string;
  key: string;
  name: string;
  type: string;
}

interface User {
  display_name: string;
  home_directory: string;
  image: string;
  language: string;
  logged_in: boolean;
  session: string;
  username: string;
}

interface Signal {
  _name: string;
  _callbacks: ((...args: any[]) => void)[];
  connect(callback: (...args: any[]) => void): void;
  disconnect(callback: (...args: any[]) => void): void;
  _emit(...args: any[]): void;
}

interface Greeter {
  authentication_complete: Signal;
  show_message: Signal;
  show_prompt: Signal;
  get authentication_user(): string | null;
  get can_hibernate(): boolean;
  get can_restart(): boolean;
  get can_shutdown(): boolean;
  get can_suspend(): boolean;
  get in_authentication(): boolean;
  get is_authenticated(): boolean;
  get language(): Language | undefined;
  get languages(): Language[];
  get sessions(): Session[];
  get users(): User[];
  set_language(value: string): boolean;
  authenticate(username: string): boolean;
  respond(password?: string): boolean;
  start_session(session: string): boolean;
  cancel_authentication(): boolean;
  hibernate(): boolean;
  restart(): boolean;
  shutdown(): boolean;
  suspend(): boolean;
}

interface GreeterComm {
  get window_metadata(): any;
  broadcast(data: any): void;
  _emit(data: any): void;
}

interface GreeterConfig {
  get branding(): any;
  get greeter(): any;
}

interface ThemeUtils {
  dirlist(path: string, only_image: boolean): Promise<string[]>;
}

declare global {
  var lightdm: Greeter | undefined;
  var greeter: Greeter | undefined;
  var greeter_comm: GreeterComm | undefined;
  var greeter_config: GreeterConfig | undefined;
  var theme_utils: ThemeUtils | undefined;
}

export type { Session, Greeter, Signal, User, Language };

globalThis.greeter ??= globalThis.lightdm;

import * as mock from "@/ts/mock";

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

const users = reactive(greeter?.users ?? []);
const sessions = reactive(greeter?.sessions ?? []);

function loadStorage<T>(key: string): T | undefined {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : undefined;
}

const lastSession = ref(loadStorage<Session>("lastSession"));
watch(lastSession, (lastSession) => {
  lastSession &&
    localStorage.setItem("lastSession", JSON.stringify(lastSession));
});
lastSession.value =
  sessions.find((s) => s.key === lastSession.value?.key) ?? sessions[0];

const lastUser = ref(loadStorage<User>("lastUser"));
const loginState = reactive({ sessionCreated: false, password: "" });
watch(lastUser, (lastUser) => {
  cancelSession();
  lastUser && localStorage.setItem("lastUser", JSON.stringify(lastUser));
});
lastUser.value =
  users.find((u) => u.username === lastUser.value?.username) ?? users[0];

function connect_show_prompt(callback: (type: string, text: string) => void) {
  greeter?.show_prompt.connect(callback);
}

function disconnect_show_prompt(
  callback: (type: string, text: string) => void,
) {
  greeter?.show_prompt.disconnect(callback);
}

function connect_show_message(callback: (type: string, text: string) => void) {
  greeter?.show_message.connect(callback);
}

function disconnect_show_message(
  callback: (type: string, text: string) => void,
) {
  greeter?.show_message.disconnect(callback);
}

function connect_authentication_complete(callback: () => void) {
  greeter?.authentication_complete.connect(callback);
}

function disconnect_authentication_complete(callback: () => void) {
  greeter?.authentication_complete.disconnect(callback);
}

function createSession() {
  // console.log("createSession");
  loginState.sessionCreated ||=
    greeter?.authenticate(lastUser.value?.username ?? "") ?? false;
}

function cancelSession() {
  if (loginState.sessionCreated) {
    // console.log("cancelSession");
    greeter?.cancel_authentication();
    loginState.password = "";
    loginState.sessionCreated = false;
  }
}

function postPassword() {
  // console.log("respond");
  return (
    loginState.sessionCreated &&
    (greeter?.respond(loginState.password) ?? false)
  );
}

function startSession() {
  // console.log("startSession");
  loginState.sessionCreated &&
    greeter?.start_session(lastSession.value?.key ?? "");
}

export {
  users,
  sessions,
  lastUser,
  lastSession,
  loginState,
  createSession,
  cancelSession,
  postPassword,
  startSession,
  connect_show_prompt,
  disconnect_show_prompt,
  connect_show_message,
  disconnect_show_message,
  connect_authentication_complete,
  disconnect_authentication_complete,
};
