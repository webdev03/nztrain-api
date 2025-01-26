// Shared stuff, like the client

import { NZTrain } from "../src";

export const client = await NZTrain.init({
  username: process.env.USERNAME!,
  password: process.env.PASSWORD!
});
