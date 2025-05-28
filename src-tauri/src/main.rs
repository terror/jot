#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use {
  serde::{Deserialize, Serialize},
  std::fs,
  tauri::AppHandle,
  typeshare::typeshare,
};

#[derive(Debug, thiserror::Error)]
enum Error {
  #[error(transparent)]
  Io(#[from] std::io::Error),
  #[error(transparent)]
  Serde(#[from] serde_json::Error),
}

impl Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

type Result<T = (), E = Error> = std::result::Result<T, E>;

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[typeshare]
enum Theme {
  Dark,
  Light,
  System,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
#[typeshare]
struct Settings {
  /// The directory where we persist notes.
  directory: String,
  /// The font to use for displaying text.
  font: String,
  /// The font size in pixels.
  font_size: u32,
  /// The theme of the application.
  theme: Theme,
}

impl From<&AppHandle> for Settings {
  fn from(value: &AppHandle) -> Self {
    let data_dir = value.path_resolver().app_data_dir().unwrap();

    Self {
      directory: data_dir.join("jot").to_string_lossy().to_string(),
      font: "Arial".to_string(),
      font_size: 12,
      theme: Theme::System,
    }
  }
}

#[tauri::command]
fn read_settings(app: AppHandle) -> Result<Settings> {
  let config_dir = app.path_resolver().app_config_dir().unwrap();

  if !config_dir.exists() {
    fs::create_dir_all(&config_dir)?;
  }

  let path = config_dir.join("settings.json");

  if !path.exists() {
    let default_settings = Settings::from(&app);
    fs::write(path, serde_json::to_string(&default_settings)?)?;
    return Ok(default_settings);
  }

  Ok(serde_json::from_str::<Settings>(&fs::read_to_string(
    &path,
  )?)?)
}

#[tauri::command]
fn write_settings(app: AppHandle, settings: Settings) -> Result {
  let config_dir = app.path_resolver().app_config_dir().unwrap();

  fs::write(
    config_dir.join("settings.json"),
    serde_json::to_string(&settings)?,
  )
  .map_err(Error::Io)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![read_settings, write_settings])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
