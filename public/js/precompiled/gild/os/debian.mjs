import { Ok, Error } from "../../gleam.mjs";

export function version(version) {
  if (version === "Bookworm") {
    return new Ok("debian/bookworm");
  } else if (version === "bookworm") {
    return new Ok("debian/bookworm");
  } else if (version === "12") {
    return new Ok("debian/bookworm");
  } else if (version === "Bullseye") {
    return new Ok("debian/bullseye");
  } else if (version === "bullseye") {
    return new Ok("debian/bullseye");
  } else if (version === "11") {
    return new Ok("debian/bullseye");
  } else if (version === "Buster") {
    return new Ok("debian/buster");
  } else if (version === "buster") {
    return new Ok("debian/buster");
  } else if (version === "10") {
    return new Ok("debian/buster");
  } else {
    return new Error("invalid debian version selected");
  }
}
