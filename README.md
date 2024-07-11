# Bun bun bun

More info: [Bun Docs](https://bun.sh/docs)

>[!TIP]
> just `bun` can be used as a shorthand for *almost* all of its commands.

## Install

### Install all dependencies

```bash
bun i
```

### Install a specific package

```bash
bun i <package>
```

#### Flags

- `-g` to install globally
- `-D` to install as a dev dependency

## Development

```bash
bun dev
```

## Build

```bash
bun run build
```

## Running

### Scripts

```bash
bun run <script>
```

Example: `bun lint`

### Binaries

```bash
bunx <binary>
```

`bun run` also works

Example: `bun eslint`

>[!NOTE]
> To use the Bun runtime (instead of Node.js), pass `--bun` to the command: `bunx --bun vite dev`

### Files

```bash
bun run <file>
```

Example: `bun src/index.ts`

## `ni`

To forget about package managers: [antfu/ni](https://github.com/antfu-collective/ni?tab=readme-ov-file#ni)
