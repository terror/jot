use super::*;

#[derive(Debug, thiserror::Error)]
pub(crate) enum Error {
  #[error(transparent)]
  Io(#[from] std::io::Error),
  #[error("Failed to resolve {0}")]
  ResolvePath(String),
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
