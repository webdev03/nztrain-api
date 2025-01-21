import * as cheerio from "cheerio";
import ky from "ky";

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
            console.log(key, "=", val);
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
    const client = new NZTrain();
    client.ky = client.ky.extend({
      prefixUrl: options.prefixUrl || "https://train.nzoi.org.nz"
    });

    const signInPageReq = await client.ky.get("accounts/sign_in");
    if (!signInPageReq.ok)
      throw Error(
        "Requesting sign-in page failed, status " + signInPageReq.status
      );

    const authenticityToken = cheerio
      .load(await signInPageReq.text())('input[name="authenticity_token"]')
      .attr("value");
    if (!authenticityToken) throw Error("Could not find authenticity token!");

    const signInReq = await client.ky.post("accounts/sign_in", {
      body: new URLSearchParams({
        authenticity_token: authenticityToken,
        "user[email]": options.username,
        "user[password]": options.password,
        "user[remember_me]": "0",
        commit: "Sign+in"
      })
    });
    if (!signInReq.ok)
      throw Error("Failed to sign in with status " + signInReq.status);

    return client;
  }
}
