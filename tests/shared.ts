// Shared stuff, like the client

import { NZTrain } from "../src";

// Uses train.nzoi.org.nz
export const client = await NZTrain.init({
  username: process.env.USERNAME!,
  password: process.env.PASSWORD!
});
