import * as $json from "../../gleam_json/gleam/json.mjs";
import * as $io from "../../gleam_stdlib/gleam/io.mjs";
import * as $iterator from "../../gleam_stdlib/gleam/iterator.mjs";
import * as $list from "../../gleam_stdlib/gleam/list.mjs";
import * as $result from "../../gleam_stdlib/gleam/result.mjs";
import * as $string from "../../gleam_stdlib/gleam/string.mjs";
import * as $string_builder from "../../gleam_stdlib/gleam/string_builder.mjs";
import * as $types from "../gild/types.mjs";
import { toList, prepend as listPrepend } from "../gleam.mjs";

export function new$() {
  return toList([["", toList([["", ""]])]]);
}

export function name(config, name) {
  return listPrepend(["gild_cluster-" + name, toList([["", ""]])], config);
}

export function member(config, member) {
  return listPrepend(member, config);
}

function get_cluster_name(config) {
  let is_name = (() => {
    let _pipe = $iterator.from_list(config);
    let _pipe$1 = $iterator.map(
      _pipe,
      (x) => {
        let $ = x[0];
        if ($.startsWith("gild_cluster-")) {
          let name$1 = $.slice(13);
          return name$1;
        } else {
          return "unknown";
        }
      },
    );
    let _pipe$2 = $iterator.to_list(_pipe$1);
    let _pipe$3 = $list.unique(_pipe$2);
    return $list.pop(_pipe$3, (x) => { return $string.contains(x, "unknown"); });
  })();
  let name$1 = $result.unwrap(is_name, ["", toList(["gild-cluster"])]);
  if (name$1[1].hasLength(1)) {
    let return_name = name$1[1].head;
    return return_name;
  } else {
    return "gild-cluster";
  }
}

function get_cluster_nodes(config) {
  let _pipe = $iterator.from_list(config);
  let _pipe$1 = $iterator.filter(
    _pipe,
    (x) => {
      let first_check = $string.contains(x[0], "gild_vm_id-");
      let second_check = $string.contains(x[0], "gild_container_id-");
      let both = [first_check, second_check];
      let return$ = (() => {
        if (both[0] && !both[1]) {
          return true;
        } else if (!both[0] && both[1]) {
          return true;
        } else {
          return false;
        }
      })();
      return return$;
    },
  );
  return $iterator.to_list(_pipe$1);
}

function get_members(nodes) {
  let node_list = $list.map(
    nodes,
    (x) => {
      let _pipe = $iterator.from_list(x[1]);
      let _pipe$1 = $iterator.map(_pipe, (y) => { return [y[0], y[1]]; });
      let _pipe$2 = $iterator.to_list(_pipe$1);
      return $list.reverse(_pipe$2);
    },
  );
  let sb_nodes = $json.to_string_builder(
    $json.array(
      node_list,
      (x) => {
        return $json.object(
          (() => {
            let _pipe = $iterator.from_list(x);
            let _pipe$1 = $iterator.map(
              _pipe,
              (y) => { return [y[0], $json.string(y[1])]; },
            );
            let _pipe$2 = $iterator.to_list(_pipe$1);
            return $list.reverse(_pipe$2);
          })(),
        );
      },
    ),
  );
  return sb_nodes;
}

export function export$(config) {
  let name$1 = get_cluster_name(config);
  let nodes = get_cluster_nodes(config);
  let members = get_members(nodes);
  let return_start = (() => {
    let _pipe = "{ \"gild_cluster\": {";
    let _pipe$1 = $string.append(_pipe, " \"meta\": {");
    let _pipe$2 = $string.append(_pipe$1, ("\"name\": \"" + name$1) + "\",");
    let _pipe$3 = $string.append(_pipe$2, "\"deploy_target\": \"self\"");
    return $string.append(_pipe$3, "}, \"members\": ");
  })();
  let return_end = "}}";
  let step1 = $string_builder.prepend(members, return_start);
  let step2 = $string_builder.append(step1, return_end);
  let step3 = $string_builder.to_string(step2);
  return $io.debug(step3);
}
