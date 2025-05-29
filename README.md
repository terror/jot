## jot

[![CI](https://github.com/terror/jot/actions/workflows/ci.yaml/badge.svg)](https://github.com/terror/jot/actions/workflows/ci.yaml)

**jot** is a developer-focused daily note-taking application.

<img width="912" alt="Screenshot 2025-05-28 at 11 12 05 PM" src="https://github.com/user-attachments/assets/417d5fbb-7625-4396-8d2b-ff048e849a35" />

I'm writing this to encourage myself to do more daily note-taking, while also
having a custom app I can easily extend and integrate with whatever services I
want.

## Installation

As of now, the only way to get **jot** on your system, is to build from source:

```bash
git clone https://github.com/terror/jot
bun install
bun tauri build --bundles <target>
```

The app should be available to use in `src-tauri/target/release/bundle`.

**n.b.** You'll need a `TIPTAP_PRO_TOKEN` set in the environment in order to
install the `@tiptap-pro/extension-mathematics` package.

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
