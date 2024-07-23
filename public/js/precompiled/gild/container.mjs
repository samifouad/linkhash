import { toList, prepend as listPrepend } from "../gleam.mjs";

export function config() {
  return toList([]);
}

export function image(config, image) {
  return listPrepend(["image", image], config);
}

export function name(config, name) {
  return listPrepend(["name", name], config);
}

export function version(config, version) {
  return listPrepend(["version", version], config);
}
