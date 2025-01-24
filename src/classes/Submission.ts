import * as cheerio from "cheerio";
import type { NZTrain } from "./NZTrain";

// https://github.com/NZOI/nztrain/blob/master/app/models/submission/judge_data.rb#L153
type Judgement =
  | "Correct!"
  | "Wrong Answer"
  | `Partial Score ${number}/1.00` // Not sure how this works
  | "Evaluator Errored"
  | "Time Limit Exceeded"
  | "Time Limit Exceeded (Wall)"
  | "Runtime Error"
  | "Fatal Signal"
  | "Memory Limit Exceeded"
  | "Pending"
  | "Cancelled";

/**
 * Class for problem Submissions on NZTrain.
 * @param id The ID of the submission.
 */
export class Submission {
  client: NZTrain;
  id: number;

  constructor(client: NZTrain, id: number) {
    this.client = client;
    this.id = id;
  }

  /**
   * Gets information about the submission, including the overall score and information about the tests.
   * @returns The data of the submission.
   */
  async getData() {
    const req = await this.client.ky.get(`submissions/${this.id}`);
    const $ = cheerio.load(await req.text());

    // If this element exists, then it has been judged
    const judged = $("#submission_judged").length !== 0;
    const score = judged
      ? Number(/\d+(?=%)/.exec($("#submission_judged").text())![0])
      : -1;

    const resultsTable = $("table.results").has("tbody.test_set").first();

    const results = resultsTable
      .find("tbody.test_set")
      .get()
      .map((x) => {
        const el = $(x);
        const status = el.hasClass("status_correct")
          ? ("Correct" as const)
          : el.hasClass("status_wrong")
            ? ("Wrong" as const)
            : el.hasClass("status_pending")
              ? ("Pending" as const)
              : el.hasClass("status_partial")
                ? ("Partial" as const)
                : null;

        const name = el.find("tr:first th.test_name").text();

        // https://github.com/NZOI/nztrain/blob/master/app/views/submissions/show.html.erb#L98
        const type = name.startsWith("Sample")
          ? ("Sample" as const)
          : ("Test" as const);
        const prerequisite = name.endsWith("Prerequisite");

        const setScore = Number(el.find("tr:first th.judgement").text());

        const cases = el
          .find("tr.test_case")
          .get()
          .map((y) => ({
            status: $(y).hasClass("status_correct")
              ? ("Correct" as const)
              : $(y).hasClass("status_wrong")
                ? ("Wrong" as const)
                : $(y).hasClass("status_pending")
                  ? ("Pending" as const)
                  : $(y).hasClass("status_partial")
                    ? ("Partial" as const)
                    : null,
            time: $(y).find(".test_time").first().text(),
            memory: $(y).find(".test_memory").first().text(),
            judgement: $(y).find(".judgement").first().text() as Judgement
          }));
        return {
          /**
           * Whether the set is a Sample or a Test.
           */
          type,
          /**
           * Whether the set is a prerequisite or not.
           */
          prerequisite,
          /**
           * The total score of the set.
           */
          score: setScore,
          /**
           * The overall status of the set.
           */
          status,
          /**
           * The individual cases in the set.
           */
          cases
        };
      });
    return {
      /**
       * Whether the submission has been judged or not.
       */
      judged,
      /**
       * The score of the submission.
       * Note: If the submission has not been judged, this will be -1.
       */
      score,
      /**
       * The results of the submission.
       */
      results
    };
  }
}
