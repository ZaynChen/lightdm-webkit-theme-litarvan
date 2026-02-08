import type {
  Session as SessionClass,
  Greeter as GreeterClass,
  Signal as SignalClass,
} from "@/ts/greeter";

class Session implements SessionClass {
  name;
  key;
  type;
  comment;
  constructor(name: string, key: string, type?: string, comment?: string) {
    this.name = name;
    this.key = key;
    this.type = type ?? "x";
    this.comment = comment ?? "";
  }
}

class User {
  background = "";
  display_name;
  home_directory;
  image;
  language;
  layout = "";
  layouts: string[] = [];
  logged_in = false;
  session;
  username;
  constructor(
    display_name: string,
    username: string,
    image: string,
    language?: string,
    session?: string,
  ) {
    this.display_name = display_name;
    this.username = username;
    this.image = image;
    this.language = language ?? "";
    this.home_directory = "/home/" + username + "/";
    this.session = session ?? "";
  }
}

class Signal implements SignalClass {
  _name;
  _callbacks: ((...args: unknown[]) => void)[];
  constructor(name: string) {
    this._name = name;
    this._callbacks = [];
  }
  connect(callback: (...args: unknown[]) => void) {
    this._callbacks.push(callback);
  }
  disconnect(callback: (...args: unknown[]) => void) {
    this._callbacks = this._callbacks.filter((_cb) => _cb !== callback);
  }
  _emit(...args: unknown[]) {
    this._callbacks.forEach((callback) => {
      callback(...args);
    });
  }
}

const DEBUG_PASSWORD = "test";
let brightness = 85;
let password;

// greeter-webkit2-greeter api doc: https://doclets.io/Antergos/web-greeter/stable
class Greeter implements GreeterClass {
  authentication_complete = new Signal("authentication_complete");
  autologin_timer_expired = new Signal("autologin_timer_expired");
  show_message = new Signal("show_message");
  show_prompt = new Signal("show_prompt");
  authentication_user: string | null = null;
  autologin_guest = false;
  autologin_timeout = 0;
  autologin_user = null;
  can_hibernate = true;
  can_restart = true;
  can_shutdown = true;
  can_suspend = true;
  default_session = "plasma-shell";
  has_guest_account = false;
  hide_users_hint = false;
  hostname = "";
  in_authentication = true;
  is_authenticated = false;
  language = {
    code: "en_US.utf8",
    name: "American English",
    territory: "United States",
  };
  languages = [
    {
      name: "American English",
      code: "en_US.utf8",
      territory: "United States",
    },
    {
      name: "Français",
      code: "fr_FR.utf8",
      territory: "",
    },
    {
      name: "中文",
      code: "zh_CN.utf8",
      territory: "中国",
    },
  ];
  layout = {
    name: "us",
    description: "English (US)",
    short_description: "en",
  };
  layouts = [
    {
      name: "us",
      description: "English (US)",
      short_description: "en",
    },
  ];
  lock_hint = false;
  remote_sessions = [new Session("Gnome 3", "gnome-shell")];
  select_guest_hint = false;
  select_user_hint = null;
  sessions = [
    new Session("KDE 5", "plasma-shell"),
    new Session("Gnome 3", "gnome-shell"),
    new Session("XFCE 4", "xfce"),
    new Session("Cinnamon", "cinnamon"),
    new Session("i3", "i3"),
    new Session("Hyprland", "hyprland"),
    new Session("xmonad", "xmonad"),
    new Session("Qtile", "qtile"),
    new Session("Kodi", "kodi"),
    new Session("exwm", "exwm"),
    new Session("Openbox", "openbox"),
    new Session("Sway", "sway"),
  ];
  show_manual_login_hint = false;
  show_remote_login_hint = false;
  users = [
    new User("John Doe", "johnd", "", "en_US.UTF-8"),
    new User("Adrien Navratil", "litarvan", "litarvan", "fr_FR.UTF-8"),
    new User("Zayn Chen", "zaync", "", "zh_CN.UTF-8", "hyprland"),
  ];
  shared_data_directory = null;
  set_language = (_: string) => {
    return true;
  };
  authenticate = (username: string) => {
    console.log(`Starting authenticating : '${username}'`);
    this.authentication_user = username;

    let text = "Password: ";
    if (text === "Password: " && password !== undefined) {
      this.respond(password);
    }

    return true;
  };
  respond = (password: string) => {
    console.log(`Password provided : '${password}'`);
    if (password === DEBUG_PASSWORD) {
      this.is_authenticated = true;
      this.authentication_complete._emit();
    }
    return true;
  };
  start_session = (session: string) => {
    alert(`Start session: '${session}') !`);
    return true;
  };
  cancel_authentication = () => {
    console.log("Auth cancelled");
    return true;
  };
  authenticate_as_guest = () => {
    return false;
  };
  cancel_autologin = () => {
    return false;
  };
  shutdown = () => {
    alert("(DEBUG: System is shutting down)");
    return true;
  };
  hibernate = () => {
    alert("(DEBUG: System is hibernating)");
    return true;
  };
  suspend = () => {
    alert("(DEBUG: System is suspending)");
    return true;
  };
  restart = () => {
    alert("(DEBUG: System is rebooting)");
    return true;
  };
  can_access_battery = true;
  can_access_brightness = true;
  battery_data = {
    level: 15,
    ac_status: true,
  };
  battery_update = new Signal("battery_update");
  brightness_update = new Signal("brightness");
}

let greeter = new Greeter();

Object.defineProperty(greeter, "brightness", {
  get: () => {
    return brightness;
  },
  set: (value) => {
    brightness = value;
    greeter.brightness_update._emit();
  },
});

let theme_utils = {
  async dirlist(_path: string, _only_image: boolean): Promise<string[]> {
    return ["/src/assets/images/litarvan.png"];
  },
};

let greeter_config = {
  branding: {
    background_images_dir: "nowhere this is live test",
  },
  greeter: {},
};

let greeter_comm = {
  window_metadata: null,
  broadcast(_: any) {},
  _emit(_: any) {},
};

export { greeter, theme_utils, greeter_config, greeter_comm };
