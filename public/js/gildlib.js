export default {
    "gild/vm": `import gild/types.{type Config, type VM}
import gleam/int
import gleam/iterator
import gleam/json
import gleam/list
import gleam/string

// Function to create an empty configuration
pub fn new() -> Config {
  []
}

// Function to add an OS key-value pair to the configuration
pub fn os(config: Config, name: Result(String, String)) -> Config {
  case name {
    Ok(name) -> [#("gild_vm_os", name), ..config]
    Error(msg) -> [#("gild_vm_error", msg), ..config]
  }
}

// Function to add a name key-value pair to the configuration
pub fn name(config: Config, name: String) -> Config {
  [#("gild_vm_name", name), ..config]
}

// Function to add an OS key-value pair to the configuration
pub fn update(config: Config) -> Config {
  [#("gild_vm_update", "true"), ..config]
}

// Function to add an OS key-value pair to the configuration
pub fn install(config: Config, command: String) -> Config {
  let rand = int.to_string(int.random(100_000))

  case string.contains(does: command, contain: " ") {
    False -> [#("gild_vm_install_" <> rand, command), ..config]
    True -> list.concat([return_command_list(command), config])
  }
}

// return entire data struture
pub fn return(config: Config) -> VM {
  let vm_name = case list.key_find(config, "gild_vm_name") {
    Ok(name) -> "gild_vm_id-" <> name
    Error(_) -> "gild_vm_id-unknown"
  }
  #(vm_name, config)
}

// 
pub fn export(config: Config) -> String {
  let export_config = return(config)


    json.object(
      iterator.from_list(export_config.1)
      |> iterator.map(fn(x) { #(x.0, json.string(x.1)) })
      |> iterator.to_list()
      |> list.reverse(),
    )
    |> json.to_string
}

// local helper function to split string
// then transform each list item into a tuple
fn return_command_list(command: String) -> Config {
  let commands = list.unique(string.split(command, on: " "))

  iterator.from_list(commands)
  |> iterator.map(fn(x) {
    let rand = int.to_string(int.random(100_000))
    #("gild_vm_install_" <> rand, x)
  })
  |> iterator.to_list()
  |> list.reverse()
}`,
    "gild/types": `pub type KV =
  #(String, String)

pub type Config =
  List(KV)

pub type VM =
  #(String, Config)

pub type Cluster =
  List(VM)`,
    "gild/cluster": `import gild/types.{type Cluster, type VM}
import gleam/io
import gleam/iterator
import gleam/json
import gleam/list
import gleam/result
import gleam/string
import gleam/string_builder.{type StringBuilder}

// import gleam/iterator.{from_list, map, to_list}
// import gleam/json.{object, string}

// Function to create an empty configuration
pub fn new() -> Cluster {
  [#("", [#("", "")])]
}

// Function to add a name key-value pair to the configuration
pub fn name(config: Cluster, name: String) -> Cluster {
  [#("gild_cluster-" <> name, [#("", "")]), ..config]
}

// Function to add a name key-value pair to the configuration
pub fn member(config: Cluster, member: VM) -> Cluster {
  [member, ..config]
}

pub fn export(config: Cluster) {
  let name: String = get_cluster_name(config)

  let nodes: Cluster = get_cluster_nodes(config)

  let members: StringBuilder = get_members(nodes)

  let return_start: String =
    "{ 'gild_cluster': {"
    |> string.append(" 'meta': {")
    |> string.append("'name': '" <> name <> "',")
    |> string.append("'deploy_target': 'self'")
    |> string.append("}, 'members': ")

  let return_end: String = "}}"

  let step1 = string_builder.prepend(members, return_start)
  let step2 = string_builder.append(step1, return_end)
  let step3 = string_builder.to_string(step2)

  io.debug(step3)
  //"{" <> export_config.0 <> ": " <> json_export <> "}"
  //"{ 'gild_vm': " <> json_export <> "}"
}

// [
//   #("gild_vm_id-home", [#("gild_vm_install", "mysql_server"), #("gild_vm_install", "apache2"), #("gild_vm_update", "true"), #("gild_vm_os", "debian/bookworm"), #("gild_vm_name", "home")]), 
//   #("gild_vm_id-home", [#("gild_vm_install", "mysql_server"), #("gild_vm_update", "true"), #("gild_vm_os", "debian/bookworm"), #("gild_vm_name", "home")]),
//   #("cluster-from africa with love", [#("", "")]), #("", [#("", "")])
// ]

fn get_cluster_name(config: Cluster) -> String {
  let is_name =
    iterator.from_list(config)
    |> iterator.map(fn(x) {
      case x.0 {
        "gild_cluster-" <> name -> name
        _ -> "unknown"
      }
    })
    |> iterator.to_list
    |> list.unique
    |> list.pop(fn(x) { string.contains(does: x, contain: "unknown") })

  let name = result.unwrap(is_name, #("", ["gild-cluster"]))

  case name {
    #(_, [return_name]) -> return_name
    _ -> "gild-cluster"
  }
}

fn get_cluster_nodes(config: Cluster) -> Cluster {
  iterator.from_list(config)
  |> iterator.filter(fn(x) {
    let first_check = string.contains(does: x.0, contain: "gild_vm_id-")
    let second_check = string.contains(does: x.0, contain: "gild_container_id-")
    let both = #(first_check, second_check)

    let return = case both {
      #(True, False) -> True
      #(False, True) -> True
      _ -> False
    }

    return
  })
  |> iterator.to_list
}

fn get_members(nodes: Cluster) -> StringBuilder {
  let node_list =
    list.map(nodes, fn(x) {
      iterator.from_list(x.1)
      |> iterator.map(fn(y) { #(y.0, y.1) })
      |> iterator.to_list()
      |> list.reverse()
    })

  let sb_nodes =
    json.to_string_builder(
      json.array(node_list, of: fn(x) {
        json.object(
          iterator.from_list(x)
          |> iterator.map(fn(y) { #(y.0, json.string(y.1)) })
          |> iterator.to_list()
          |> list.reverse(),
        )
      }),
    )

  sb_nodes
}`,
    "gild/os/debian": `pub fn version(version: String) -> Result(String, String) {
  case version {
    "Bookworm" | "bookworm" | "12" -> Ok("debian/bookworm")
    "Bullseye" | "bullseye" | "11" -> Ok("debian/bullseye")
    "Buster" | "buster" | "10" -> Ok("debian/buster")
    _ -> Error("invalid debian version selected")
  }
}`,
    "gild/os/ubuntu": `pub type OS {
  Ubuntu(version: String)
  Debian(version: String)
  Arch(version: String)
  CentOS(version: String)
}

pub fn version(version: String) -> Result(#(String, String), String) {
  case version {
    "Noble" | "noble" | "24.04" -> Ok(#("ubuntu", "noble"))
    "Mantic" | "mantic" | "23.10" -> Ok(#("ubuntu", "mantic"))
    "Jammy" | "jammy" | "22.04" -> Ok(#("ubuntu", "jammy"))
    "Focal" | "focal" | "20.04" -> Ok(#("ubuntu", "focal"))
    "Bionic" | "bionic" | "18.04" -> Ok(#("ubuntu", "bionic"))
    _ -> Error("invalid ubuntu version selected")
  }
}
// pub fn return_os(os: String) -> String {
//   case os {
//     Ubuntu(_) -> "Ubuntu"
//     Debian(_) -> "Debian"
//     Arch(_) -> "Arch"
//     CentOS(_) -> "CentOS"
//   }
// }

// pub type Ubuntu {
//   NobleNumbat
//   ManticMinotaur
//   JammyJellyfish
// }

// pub type DebianVersion {
//   Bookworm
//   Bullseye
//   Buster
// }`,
  "gleam/json": `import gleam/bit_array
import gleam/dynamic.{type Dynamic}
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/result
import gleam/string_builder.{type StringBuilder}

pub type Json

pub type DecodeError {
  UnexpectedEndOfInput
  UnexpectedByte(String)
  UnexpectedSequence(String)
  UnexpectedFormat(List(dynamic.DecodeError))
}

pub fn decode(
  from json: String,
  using decoder: dynamic.Decoder(t),
) -> Result(t, DecodeError) {
  do_decode(from: json, using: decoder)
}

@target(erlang)
fn do_decode(
  from json: String,
  using decoder: dynamic.Decoder(t),
) -> Result(t, DecodeError) {
  let bits = bit_array.from_string(json)
  decode_bits(bits, decoder)
}

@target(javascript)
fn do_decode(
  from json: String,
  using decoder: dynamic.Decoder(t),
) -> Result(t, DecodeError) {
  use dynamic_value <- result.then(decode_string(json))
  decoder(dynamic_value)
  |> result.map_error(UnexpectedFormat)
}

@external(javascript, "../gleam_json_ffi.mjs", "decode")
fn decode_string(a: String) -> Result(Dynamic, DecodeError)

pub fn decode_bits(
  from json: BitArray,
  using decoder: dynamic.Decoder(t),
) -> Result(t, DecodeError) {
  use dynamic_value <- result.then(decode_to_dynamic(json))
  decoder(dynamic_value)
  |> result.map_error(UnexpectedFormat)
}

@external(erlang, "gleam_json_ffi", "decode")
fn decode_to_dynamic(json: BitArray) -> Result(Dynamic, DecodeError) {
  case bit_array.to_string(json) {
    Ok(string) -> decode_string(string)
    Error(Nil) -> Error(UnexpectedByte(""))
  }
}

pub fn to_string(json: Json) -> String {
  do_to_string(json)
}

@external(erlang, "gleam_json_ffi", "json_to_string")
@external(javascript, "../gleam_json_ffi.mjs", "json_to_string")
fn do_to_string(a: Json) -> String

pub fn to_string_builder(json: Json) -> StringBuilder {
  do_to_string_builder(json)
}

@external(erlang, "gleam_json_ffi", "json_to_iodata")
@external(javascript, "../gleam_json_ffi.mjs", "json_to_string")
fn do_to_string_builder(a: Json) -> StringBuilder

pub fn string(input: String) -> Json {
  do_string(input)
}

@external(erlang, "gleam_json_ffi", "string")
@external(javascript, "../gleam_json_ffi.mjs", "identity")
fn do_string(a: String) -> Json


pub fn bool(input: Bool) -> Json {
  do_bool(input)
}

@external(erlang, "gleam_json_ffi", "bool")
@external(javascript, "../gleam_json_ffi.mjs", "identity")
fn do_bool(a: Bool) -> Json

pub fn int(input: Int) -> Json {
  do_int(input)
}

@external(erlang, "gleam_json_ffi", "int")
@external(javascript, "../gleam_json_ffi.mjs", "identity")
fn do_int(a: Int) -> Json

pub fn float(input: Float) -> Json {
  do_float(input)
}

@external(erlang, "gleam_json_ffi", "float")
@external(javascript, "../gleam_json_ffi.mjs", "identity")
fn do_float(input input: Float) -> Json

pub fn null() -> Json {
  do_null()
}

@external(erlang, "gleam_json_ffi", "null")
@external(javascript, "../gleam_json_ffi.mjs", "do_null")
fn do_null() -> Json

pub fn nullable(from input: Option(a), of inner_type: fn(a) -> Json) -> Json {
  case input {
    Some(value) -> inner_type(value)
    None -> null()
  }
}

pub fn object(entries: List(#(String, Json))) -> Json {
  do_object(entries)
}

@external(erlang, "gleam_json_ffi", "object")
@external(javascript, "../gleam_json_ffi.mjs", "object")
fn do_object(entries entries: List(#(String, Json))) -> Json

pub fn array(from entries: List(a), of inner_type: fn(a) -> Json) -> Json {
  entries
  |> list.map(inner_type)
  |> preprocessed_array
}

pub fn preprocessed_array(from: List(Json)) -> Json {
  do_preprocessed_array(from)
}

@external(erlang, "gleam_json_ffi", "array")
@external(javascript, "../gleam_json_ffi.mjs", "array")
fn do_preprocessed_array(from from: List(Json)) -> Json`
}