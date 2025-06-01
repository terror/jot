use super::*;

const SETTINGS_FILE_NAME: &str = "settings.json";

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub(crate) enum Theme {
  Dark,
  Light,
  System,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(rename_all = "camelCase")]
#[typeshare]
pub(crate) struct Settings {
  /// The directory where we persist notes.
  pub(crate) directory: String,
  /// The font to use for displaying text.
  pub(crate) font: String,
  /// The font size in pixels.
  pub(crate) font_size: u32,
  /// The theme of the application.
  pub(crate) theme: Theme,
}

impl TryFrom<&AppHandle> for Settings {
  type Error = Error;

  fn try_from(value: &AppHandle) -> Result<Self, Self::Error> {
    let data_dir = value
      .path_resolver()
      .app_data_dir()
      .ok_or(Error::ResolvePath("tauri app data dir".into()))?;

    Ok(Self {
      directory: data_dir.join("jot").to_string_lossy().to_string(),
      font: "Arial".to_string(),
      font_size: 12,
      theme: Theme::System,
    })
  }
}

pub(crate) mod api {
  use super::*;

  #[tauri::command]
  pub(crate) fn read_settings(app: AppHandle) -> Result<Settings> {
    let config_dir = app
      .path_resolver()
      .app_config_dir()
      .ok_or(Error::ResolvePath("tauri app config dir".into()))?;

    if !config_dir.exists() {
      fs::create_dir_all(&config_dir)?;
    }

    let path = config_dir.join(SETTINGS_FILE_NAME);

    if !path.exists() {
      let default_settings = Settings::try_from(&app)?;
      fs::write(path, serde_json::to_string(&default_settings)?)?;
      return Ok(default_settings);
    }

    Ok(serde_json::from_str::<Settings>(&fs::read_to_string(
      &path,
    )?)?)
  }

  #[tauri::command]
  pub(crate) fn write_settings(app: AppHandle, settings: Settings) -> Result {
    let config_dir = app
      .path_resolver()
      .app_config_dir()
      .ok_or(Error::ResolvePath("tauri app config dir".into()))?;

    fs::write(
      config_dir.join(SETTINGS_FILE_NAME),
      serde_json::to_string(&settings)?,
    )
    .map_err(Error::Io)
  }
}