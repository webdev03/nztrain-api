import * as cheerio from "cheerio";
import type { NZTrain } from "./NZTrain";

export class Problem {
  id: number;
  client: NZTrain;
  /**
   * Class for Problems on NZTrain
   * @param id The ID of the problem
   */
  constructor(client: NZTrain, id: number) {
    this.client = client;
    this.id = id;
  }

  async getData() {
    const problemReq = await this.client.ky.get(`problems/${this.id}`);
    if (!problemReq.ok)
      throw Error("Failed to get problem with status " + problemReq.status);

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
    const problemHTML = $(".statement").html()!.trim();

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
}
