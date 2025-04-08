set dotenv-load

export EDITOR := 'nvim'

alias d := dev
alias f := fmt-web

default:
  just --list

dev:
  bun run tauri dev

fmt-web:
  prettier --write .

