## jot

[![CI](https://github.com/terror/jot/actions/workflows/ci.yaml/badge.svg)](https://github.com/terror/jot/actions/workflows/ci.yaml)

**jot** is a developer-focused daily note-taking application.

> [!WARNING]
> This project is in very early stages.

<img width="1134" alt="Screenshot 2025-04-09 at 2 19 15 AM" src="https://github.com/user-attachments/assets/48420b03-4c29-4d8d-a07a-afe9b2d244b2" />

I'm writing this to encourage myself to do more daily note-taking, while also
having a custom app I can easily extend and integrate with whatever services I
want.

## Development

I'm using [Tauri](https://tauri.app/) to build this desktop app,
[Rust](https://www.rust-lang.org/) is used on the backend and
[React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) are
used on the frontend.

To get started contributing, first install dependencies:

```bash
bun install
```

Then start the development server:

```bash
bun run tauri dev
```

Expect `http://localhost:1420/` to be in use and the desktop app ready to view.

## Prior Art

This project is heavily inspired by
[heynote](https://github.com/heyman/heynote), a dedicated scratchpad for
developers.

**jot** is my own similar version, giving me more control over what/what not to
implement.
