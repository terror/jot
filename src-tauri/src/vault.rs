use super::*;

#[derive(Debug, Deserialize, Serialize)]
#[typeshare]
pub(crate) struct VaultEntry {
  /// The filename on disk, formatted as `MM-DD-YY.md`.
  filename: String,
  /// The content of the file.
  content: String,
}

#[derive(Debug, Deserialize, Serialize)]
#[typeshare]
pub(crate) struct Vault {
  /// The list of entries in the vault.
  entries: Vec<VaultEntry>,
}

#[tauri::command]
pub(crate) fn load_vault(settings: Settings) -> Result<Vault> {
  let vault_dir = std::path::Path::new(&settings.directory);

  if !vault_dir.exists() {
    fs::create_dir_all(vault_dir)?;
  }

  let pattern = Regex::new(r"^(\d{2}-\d{2}-\d{2})\.md$").unwrap();

  let mut entries = Vec::new();

  for entry in fs::read_dir(vault_dir)? {
    let entry = entry?;

    let filename = entry.file_name().to_string_lossy().to_string();

    if pattern.is_match(&filename) && entry.file_type()?.is_file() {
      entries.push(VaultEntry {
        filename,
        content: fs::read_to_string(entry.path())?,
      });
    }
  }

  Ok(Vault { entries })
}

#[tauri::command]
pub(crate) fn write_vault_entry(
  settings: Settings,
  entry: VaultEntry,
) -> Result {
  let vault_dir = Path::new(&settings.directory);

  if !vault_dir.exists() {
    fs::create_dir_all(vault_dir)?;
  }

  fs::write(vault_dir.join(&entry.filename), entry.content)?;

  Ok(())
}
