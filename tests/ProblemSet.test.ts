import { client } from "./shared";
import { expect, test } from "bun:test";

test("problem set data", async () => {
  // The problem set for NZIC 2020 Round 1 (on the front page of train.nzoi.org.nz)
  expect(await client.getProblemSet(401).getData()).toEqual({
    title: "NZIC 2020 Round 1",
    problems: [
      {
        title: "Welcome to the NZIC 2020",
        points: 10,
        problem: expect.objectContaining({ id: 1148 })
      },
      {
        title: "Rimuru's Road",
        points: 100,
        problem: expect.objectContaining({ id: 1113 })
      },
      {
        title: "Paddocks",
        points: 100,
        problem: expect.objectContaining({ id: 1120 })
      },
      {
        title: "Lineup",
        points: 100,
        problem: expect.objectContaining({ id: 1144 })
      },
      {
        title: "Lake Waikaremoana",
        points: 100,
        problem: expect.objectContaining({ id: 1125 })
      },
      {
        title: "Blast Off",
        points: 100,
        problem: expect.objectContaining({ id: 1133 })
      }
    ]
  });
});
