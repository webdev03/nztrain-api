# nztrain-api

An unofficial client for the [NZTrain](https://train.nzoi.org.nz) website used by the [NZOI](https://nzoi.org.nz).
Includes full TypeScript support and JSDoc comments for an amazing developer experience.

> [!WARNING]
> This project is unaffiliated with NZTrain or the NZOI! **Use at your own risk!**

## Installation

You can install `nztrain-api` in your JavaScript or TypeScript project with one command:

```bash
npm install nztrain-api
```

Of course, you can use any package manager you would like, such as `yarn`, `pnpm`, or `bun`.

This project uses [Bun](https://bun.sh) itself, so you should use it for the best experience.

## Usage

A quick look at the API style of this library:

```ts
import { NZTrain } from "nztrain-api";

const client = await NZTrain.init({
  username: "Admin", // Change this to your real username!
  password: process.env.NZTRAIN_PASSWORD // Use an environment variable for better security!
});

const problem = client.getProblem(19); // 'Hailstone Sequences'
const problemData = await problem.getData();

console.log(problemData.title); // The title of the problem
console.log(problemData.info); // General information about the problem (input, output, memory limit, time limit)
console.log(problemData.problem); // The contents of the problem
console.log(problemData.samples); // The samples of the problem
console.log(await problem.getLanguages()); // The languages that are available

// SUBMISSION

const code = `
#include <iostream>
using namespace std;
int main() {
  ...
`;

const submission = await problem.submit(code, "11"); // Submit code to the NZTrain judge (id 11 is C++17)
// ... later
console.log(await submission.getData()); // Data about the submission
```

More information is available in the [wiki](https://github.com/webdev03/nztrain-api/wiki) or the JSDoc comments that should be available in your code editor.
Alternatively, you can view the [source code](https://github.com/webdev03/nztrain-api) or the type definitions included in the NPM package.

## Notes

`nztrain-api` is ESM-only, and cannot be imported with `require`.

## Contributing

Contributions are welcome! Just make an issue or a pull request!

If you have any concerns, please make an issue on this repository.
