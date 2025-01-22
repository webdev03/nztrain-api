import * as cheerio from "cheerio";
import ky from "ky";

import { Problem } from "./Problem";

/**
 * Class that handles the whole code.
 */
export class NZTrain {
  /**
   * The cookie jar holds the cookies.
   */
  cookieJar = new Map<string, string>();
  /**
   * ky handles all of the HTTP requests.
   */
  ky = ky.create({
    hooks: {
      beforeRequest: [
        (request) => {
          request.headers.set(
            "Cookie",
            [...this.cookieJar.entries().map((x) => `${x[0]}=${x[1]}`)].join(
              "; "
            )
          );
        }
      ],
      afterResponse: [
        (_request, _options, response) => {
          for (const cookie of response.headers.getSetCookie()) {
            const [key, val] = cookie.split(";")[0].split("=");
            this.cookieJar.set(key, val);
          }
        }
      ]
    }
  });

  static async init(options: {
    /**
     * The username of the account to log into.
     */
    username: string;
    /**
     * The password of the account to log into.
     */
    password: string;
    /**
     * The URL of the NZTrain instance that all requests will go to.
     * Usually https://train.nzoi.org.nz.
     */
    prefixUrl?: string;
  }) {
    if (options.prefixUrl && !options.prefixUrl.endsWith("/"))
      throw Error("Prefix URL must end with a slash");

    const client = new NZTrain();
    client.ky = client.ky.extend({
      prefixUrl: options.prefixUrl || "https://train.nzoi.org.nz"
    });

    const signInPageReq = await client.ky.get("accounts/sign_in");
    const signInPageText = await signInPageReq.text();

    // To log in, NZTrain wants an authenticity token
    const authenticityToken = cheerio
      .load(signInPageText)('input[name="authenticity_token"]')
      .attr("value");
    if (!authenticityToken) throw Error("Could not find authenticity token!");

    // Using `fetch` here because `ky` does not respect the manual redirect option
    const signInReq = await fetch(
      options.prefixUrl || "https://train.nzoi.org.nz" + "/accounts/sign_in",
      {
        method: "POST",
        headers: {
          // The cookieJar was filled by the request to get the authenticity token
          Cookie: [
            ...client.cookieJar.entries().map((x) => `${x[0]}=${x[1]}`)
          ].join("; ")
        },
        body: new URLSearchParams({
          // utf8: "\u2713", // this doesn't seem to be checked by the server
          authenticity_token: authenticityToken,
          "user[email]": options.username,
          "user[password]": options.password,
          "user[remember_me]": "0",
          commit: "Sign in"
        }),
        redirect: "manual"
      }
    );
    // Because we are not using Ky here
    for (const cookie of signInReq.headers.getSetCookie()) {
      const [key, val] = cookie.split(";")[0].split("=");
      client.cookieJar.set(key, val);
    }
    return client;
  }

  getProblem(id: number) {
    return new Problem(this, id);
  }
}
