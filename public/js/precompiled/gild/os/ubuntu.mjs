import { Ok, Error, CustomType as $CustomType } from "../../gleam.mjs";

export class Ubuntu extends $CustomType {
  constructor(version) {
    super();
    this.version = version;
  }
}

export class Debian extends $CustomType {
  constructor(version) {
    super();
    this.version = version;
  }
}

export class Arch extends $CustomType {
  constructor(version) {
    super();
    this.version = version;
  }
}

export class CentOS extends $CustomType {
  constructor(version) {
    super();
    this.version = version;
  }
}

export function version(version) {
  if (version === "Noble") {
    return new Ok(["ubuntu", "noble"]);
  } else if (version === "noble") {
    return new Ok(["ubuntu", "noble"]);
  } else if (version === "24.04") {
    return new Ok(["ubuntu", "noble"]);
  } else if (version === "Mantic") {
    return new Ok(["ubuntu", "mantic"]);
  } else if (version === "mantic") {
    return new Ok(["ubuntu", "mantic"]);
  } else if (version === "23.10") {
    return new Ok(["ubuntu", "mantic"]);
  } else if (version === "Jammy") {
    return new Ok(["ubuntu", "jammy"]);
  } else if (version === "jammy") {
    return new Ok(["ubuntu", "jammy"]);
  } else if (version === "22.04") {
    return new Ok(["ubuntu", "jammy"]);
  } else if (version === "Focal") {
    return new Ok(["ubuntu", "focal"]);
  } else if (version === "focal") {
    return new Ok(["ubuntu", "focal"]);
  } else if (version === "20.04") {
    return new Ok(["ubuntu", "focal"]);
  } else if (version === "Bionic") {
    return new Ok(["ubuntu", "bionic"]);
  } else if (version === "bionic") {
    return new Ok(["ubuntu", "bionic"]);
  } else if (version === "18.04") {
    return new Ok(["ubuntu", "bionic"]);
  } else {
    return new Error("invalid ubuntu version selected");
  }
}
