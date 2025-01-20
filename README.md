# nztrain-api

An unofficial client for the [NZTrain](https://train.nzoi.org.nz) website used by the [NZOI](https://nzoi.org.nz).
Supports ..todo.. with full TypeScript support and JSDoc comments for an amazing developer experience.

> [!WARNING]
> This project is unaffiliated with NZTrain or the NZOI! Use at your own risk!

## Installation

You can install `nztrain-api` in your JavaScript or TypeScript project with one command:

```bash
npm install nztrain-api
```

Of course, you can use any package manager you would like, such as `yarn`, `pnpm`, or `bun`.

This project uses [Bun](https://bun.sh) itself so you may want to use it for the best experience.

## Usage

```ts
import { NZTrain } from "nztrain-api";

const client = await NZTrain.init({
  username: "Admin", // Change this to your real username!
  password: process.env.NZTRAIN_PASSWORD // Use an environment variable for better security!
});

// TODO
```

## Contributing

Contributions are welcome! Just make an issue or a pull request!

If you have any concerns, please make an issue on this repository.
