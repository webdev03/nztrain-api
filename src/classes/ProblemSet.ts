import * as cheerio from "cheerio";
import type { NZTrain } from "./NZTrain";
import { Problem } from "./Problem";

/**
 * Class for problem sets on NZTrain.
 * @param id The ID of the problem set.
 */
export class ProblemSet {
  client: NZTrain;
  id: number;

  constructor(client: NZTrain, id: number) {
    this.client = client;
    this.id = id;
  }

  /**
   * Gets the data of the problem set,
   * @returns The data of the problem set.
   */
  async getData() {
    const problemSetReq = await this.client.ky.get(`problem_sets/${this.id}`);
    const $ = cheerio.load(await problemSetReq.text());

    const title = $("#main-page-title-box h1").text();

    const problems = $("table.main_table tbody tr")
      .get()
      .map((x) => ({
        /**
         * The title of the problem.
         * This is here to improve the e
         */
        title: $(x).find("a").text(),
        problem: new Problem(
          this.client,
          Number(/(?<=problems\/)\d+/.exec($(x).find("td a").attr("href")!)![0])
        ),
        points: Number($(x).find("tr td:nth-child(2)").text())
      }));

    return {
      /**
       * The title of the problem set.
       */
      title,
      /**
       * The problems in the problem set.
       */
      problems
    };
  }
}
