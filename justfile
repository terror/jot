set dotenv-load

export EDITOR := 'nvim'

alias d := dev
alias f := fmt

default:
  just --list

[group: 'dev']
dev:
  bun run tauri dev

dev-deps:
  cargo install typeshare

[group: 'format']
fmt:
  prettier --write .

[group: 'format']
fmt-check:
  bun run fmt-check

gen-types:
  typeshare -l typescript -o src/lib/typeshare.ts src-tauri

install:
  bun install
  bun tauri build --bundles app
  rm -rf /Applications/jot.app
  mv src-tauri/target/release/bundle/macos/jot.app /Applications

[group: 'check']
lint:
  bun run lint
