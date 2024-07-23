import * as $json from "../../gleam_json/gleam/json.mjs";
import * as $int from "../../gleam_stdlib/gleam/int.mjs";
import * as $iterator from "../../gleam_stdlib/gleam/iterator.mjs";
import * as $list from "../../gleam_stdlib/gleam/list.mjs";
import * as $string from "../../gleam_stdlib/gleam/string.mjs";
import * as $types from "../gild/types.mjs";
import { toList, prepend as listPrepend } from "../gleam.mjs";

export function new$() {
  return toList([]);
}

export function os(config, name) {
  if (name.isOk()) {
    let name$1 = name[0];
    return listPrepend(["gild_vm_os", name$1], config);
  } else {
    let msg = name[0];
    return listPrepend(["gild_vm_error", msg], config);
  }
}

export function name(config, name) {
  return listPrepend(["gild_vm_name", name], config);
}

export function update(config) {
  return listPrepend(["gild_vm_update", "true"], config);
}

export function return$(config) {
  let vm_name = (() => {
    let $ = $list.key_find(config, "gild_vm_name");
    if ($.isOk()) {
      let name$1 = $[0];
      return "gild_vm_id-" + name$1;
    } else {
      return "gild_vm_id-unknown";
    }
  })();
  return [vm_name, config];
}

export function export$(config) {
  let export_config = return$(config);
  let json_export = (() => {
    let _pipe = $json.object(
      (() => {
        let _pipe = $iterator.from_list(export_config[1]);
        let _pipe$1 = $iterator.map(
          _pipe,
          (x) => { return [x[0], $json.string(x[1])]; },
        );
        let _pipe$2 = $iterator.to_list(_pipe$1);
        return $list.reverse(_pipe$2);
      })(),
    );
    return $json.to_string(_pipe);
  })();
  return ("{ \"gild_vm\": " + json_export) + "}";
}

function return_command_list(command) {
  let commands = $list.unique($string.split(command, " "));
  let _pipe = $iterator.from_list(commands);
  let _pipe$1 = $iterator.map(
    _pipe,
    (x) => {
      let rand = $int.to_string($int.random(100_000));
      return ["gild_vm_install_" + rand, x];
    },
  );
  let _pipe$2 = $iterator.to_list(_pipe$1);
  return $list.reverse(_pipe$2);
}

export function install(config, command) {
  let rand = $int.to_string($int.random(100_000));
  let $ = $string.contains(command, " ");
  if (!$) {
    return listPrepend(["gild_vm_install_" + rand, command], config);
  } else {
    return $list.concat(toList([return_command_list(command), config]));
  }
}
