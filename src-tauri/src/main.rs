#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use {
  crate::{error::Error, settings::Settings},
  regex::Regex,
  serde::{Deserialize, Serialize},
  std::{fs, path::Path},
  tauri::AppHandle,
  typeshare::typeshare,
};

mod error;

#[macro_use]
mod settings;

#[macro_use]
mod vault;

type Result<T = (), E = Error> = std::result::Result<T, E>;

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      settings::api::read_settings,
      settings::api::write_settings,
      vault::api::load_vault,
      vault::api::write_vault_entry
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
