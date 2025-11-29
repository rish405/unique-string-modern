# unique-string-modern

Generate a cryptographically strong, URL-safe unique string that is shorter and faster than UUID. Zero dependencies, tiny output, ESM + CJS builds.

## Install

```bash
npm i unique-string-modern
```

## Usage

```ts
import uniqueString, { uniqueStringAsync } from "unique-string-modern";

const id = uniqueString();
// => e.g. "QvW4Vb2Q2A1G2xgPSa7yhw"

const shortId = uniqueString(12);
// => 12 chars, URL-safe

const asyncId = await uniqueStringAsync();
```

### Why URL-safe?

The output uses Base64 URL encoding (characters `A–Z`, `a–z`, `0–9`, `-`, `_`) and removes padding. This makes IDs safe for use in URLs, file names, and HTML attributes without escaping.

## API

- `uniqueString(length?: number): string` – synchronous generator. Default length `22`.
- `uniqueStringAsync(length?: number): Promise<string>` – async variant.

Both functions use the Web Crypto API (`globalThis.crypto.getRandomValues`) with a Node fallback.

## Benchmark

Quick micro-benchmark (Node):

```ts
import { performance } from "node:perf_hooks";
import uniqueString from "unique-string-modern";
import { v4 as uuidv4 } from "uuid"; // optional

const N = 100_000;

let t = performance.now();
for (let i = 0; i < N; i++) uniqueString();
console.log("unique-string-modern:", Math.round(performance.now() - t), "ms");

t = performance.now();
for (let i = 0; i < N; i++) uuidv4();
console.log("uuid v4:", Math.round(performance.now() - t), "ms");
```

Expect `unique-string-modern` to be faster and output 22 characters vs UUID's 36.

## Build & Test

```bash
npm run build
npm test
```

## Size

The minified output is under 1KB.

