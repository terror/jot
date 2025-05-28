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

[group: 'check']
lint:
  bun run lint
