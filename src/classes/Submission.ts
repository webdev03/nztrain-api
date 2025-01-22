import * as cheerio from "cheerio";
import type { NZTrain } from "./NZTrain";

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
}
