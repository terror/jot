set dotenv-load

export EDITOR := 'nvim'

alias d := dev
alias f := fmt

default:
  just --list

[group: 'dev']
dev:
  bun run tauri dev

[group: 'format']
fmt:
  prettier --write .

[group: 'format']
fmt-check:
  bun run fmt-check

[group: 'check']
lint:
  bun run lint
