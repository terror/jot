use super::*;

#[derive(Debug, Deserialize, Eq, PartialEq, Serialize)]
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

impl Vault {
  pub(crate) fn load(directory: &Path) -> Result<Self> {
    if !directory.exists() {
      fs::create_dir_all(directory).map_err(Error::from)?;
    }

    let pattern = Regex::new(r"^(\d{2}-\d{2}-\d{2})\.md$").unwrap();

    let mut entries = Vec::new();

    for entry in fs::read_dir(directory).map_err(Error::from)? {
      let entry = entry.map_err(Error::from)?;

      let path = entry.path();

      let filename = path.file_name().unwrap().to_string_lossy().to_string();

      if pattern.is_match(&filename) && path.is_file() {
        entries.push(VaultEntry {
          filename,
          content: fs::read_to_string(path).map_err(Error::from)?,
        });
      }
    }

    Ok(Self { entries })
  }

  pub(crate) fn write_entry(
    directory: &Path,
    entry: &VaultEntry,
  ) -> Result<()> {
    if !directory.exists() {
      fs::create_dir_all(directory).map_err(Error::from)?;
    }

    fs::write(directory.join(&entry.filename), &entry.content)
      .map_err(Error::from)
  }

  #[cfg(test)]
  pub fn entries(&self) -> &[VaultEntry] {
    &self.entries
  }
}

pub(crate) mod api {
  use super::*;

  #[tauri::command]
  pub(crate) fn load_vault(settings: Settings) -> Result<Vault> {
    Vault::load(&Path::new(&settings.directory))
  }

  #[tauri::command]
  pub(crate) fn write_vault_entry(
    settings: Settings,
    entry: VaultEntry,
  ) -> Result {
    Vault::write_entry(&Path::new(&settings.directory), &entry)
  }
}

#[cfg(test)]
mod tests {
  use {super::*, tempdir::TempDir};

  #[test]
  fn load_vault() {
    let temp_dir = TempDir::new("vault_test").unwrap();

    fs::write(temp_dir.path().join("01-01-23.md"), "Test content 1").unwrap();
    fs::write(temp_dir.path().join("02-01-23.md"), "Test content 2").unwrap();

    fs::write(temp_dir.path().join("invalid.txt"), "Should not be loaded")
      .unwrap();

    let vault = Vault::load(temp_dir.path()).unwrap();

    assert_eq!(
      vault.entries(),
      &[
        VaultEntry {
          filename: "01-01-23.md".to_string(),
          content: "Test content 1".to_string(),
        },
        VaultEntry {
          filename: "02-01-23.md".to_string(),
          content: "Test content 2".to_string(),
        },
      ]
    );
  }

  #[test]
  fn write_entry() {
    let temp_dir = TempDir::new("vault_test").unwrap();

    let entry = VaultEntry {
      filename: "01-01-23.md".to_string(),
      content: "Test content".to_string(),
    };

    Vault::write_entry(temp_dir.path(), &entry).unwrap();

    assert_eq!(
      fs::read_to_string(temp_dir.path().join("01-01-23.md")).unwrap(),
      "Test content"
    );
  }
}
