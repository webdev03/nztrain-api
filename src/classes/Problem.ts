import * as cheerio from "cheerio";
import type { NZTrain } from "./NZTrain";
import { Submission } from "./Submission";

/**
 * Class for Problems on NZTrain.
 * @param id The ID of the problem.
 */
export class Problem {
  client: NZTrain;
  id: number;

  constructor(client: NZTrain, id: number) {
    this.client = client;
    this.id = id;
  }

  async getData() {
    const problemReq = await this.client.ky.get(`problems/${this.id}`);
    const $ = cheerio.load(await problemReq.text());

    const [inputInfo, outputInfo, memoryInfo, timeInfo] = $("#main-container b")
      .get()
      .map((x) => $(x.nextSibling!).text());

    const samples = $("ul.samples li")
      .get()
      .map((x) => ({
        input: $(x).find(".input pre").text(),
        output: $(x).find(".output pre").text()
      }));

    const problemText = $(".statement").text().trim();
    const problemHTML = $(".statement").html()!;

    return {
      info: {
        input: inputInfo,
        output: outputInfo,
        memory: memoryInfo,
        time: timeInfo
      },
      problem: {
        text: problemText,
        html: problemHTML
      },
      samples
    };
  }

  async getLanguages() {
    const submitPageReq = await this.client.ky.get(
      `problems/${this.id}/submit`
    );

    const $ = cheerio.load(await submitPageReq.text());
    return $("select#paste_submission_language_id option")
      .get()
      .map((x) => ({
        /**
         * The ID of the language
         */
        id: $(x).attr("value"),
        type: $(x).parent().attr("label"),
        name: $(x).text()
      }));
  }

  /**
   * Submits code to NZTrain for judging.
   * @param code The code to submit.
   * @param langId The ID of the language to submit with. `.getLanguages()` returns all available languages.
   * @returns An instance of Submission for further operations.
   */
  async submit(code: string, langId: string) {
    const submitPageReq = await this.client.ky.get(
      `problems/${this.id}/submit`
    );

    const $ = cheerio.load(await submitPageReq.text());
    const authenticityToken = $(
      'form#paste_new_submission input[name="authenticity_token"]'
    ).attr("value");

    const formData = new FormData();
    formData.set("authenticity_token", authenticityToken);
    formData.set("submission[language_id]", langId);
    formData.set("commit", "Submit");
    formData.set("submission[source]", code);

    const req = await this.client.ky.post(`problems/${this.id}/submit`, {
      body: formData
    });
    return new Submission(
      this.client,
      // Extract the ID from the URL
      Number(/(?<=submissions\/)\d+/gm.exec(req.url))
    );
  }
}
