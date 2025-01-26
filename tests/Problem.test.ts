import { client } from "./shared";
import { expect, test } from "bun:test";

test("languages list", async () => {
  const languages = [
    { id: "11", type: "Current", name: "C++17" },
    { id: "12", type: "Current", name: "C11" },
    { id: "14", type: "Current", name: "Python 3.8" },
    { id: "16", type: "Current", name: "C# 8.0" },
    { id: "13", type: "Current", name: "Java 11" },
    { id: "15", type: "Current", name: "JavaScript (V8 8.1)" },
    { id: "3", type: "Current", name: "Haskell 2010" },
    { id: "8", type: "Current", name: "Ruby 2.2" },
    { id: "9", type: "Current", name: "J 8.03" },
    { id: "10", type: "Other", name: "C++14" },
    { id: "4", type: "Other", name: "C99" },
    { id: "17", type: "Other", name: "Python 3.6 (PyPy 7.3)" }
  ];

  // Some random questions
  // Every problem should have the same languages
  for (const id of [19, 73, 614, 1113]) {
    expect(await client.getProblem(id).getLanguages()).toEqual(languages);
  }
});

test("problem data", async () => {
  // The problem 'Hello, World!'
  expect(await client.getProblem(73).getData()).toEqual({
    title: "Hello, World!",
    info: {
      input: "Standard Input (stdin)",
      output: "Standard Output (stdout)",
      memory: "64 megabytes",
      time: "1.0 seconds"
    },
    problem: {
      text: expect.any(String),
      html: expect.any(String)
    },
    samples: [{ input: "\n", output: "Hello, World!\n" }]
  });
});
