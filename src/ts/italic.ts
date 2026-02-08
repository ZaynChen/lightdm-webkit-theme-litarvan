import { italicDisabled } from "./translations";

export default function (el: HTMLElement, custom?: boolean) {
  if (!italicDisabled()) {
    const classes = el.classList;
    if (classes.contains("italic")) {
      return;
    }

    classes.add("italic");
    if (custom) {
      classes.add("custom-italic");
    }
  }
}
