import app from "./app";
import request from "supertest";
test("Testing announce path", async () => {
  const response: any = await request(app).get(
    "/announce?info_hash=m%a2w%26%d3L%a6%94_(%b2%c6%e3%ac%a1%89s%fb%16%25&event=started"
    //   "peer_id= -DE203s-xE_kJwH8WXxe&" +
    //   "port=58018&" +
    //   "uploaded=0&" +
    //   "downloaded=0&" +
    //   "left=0&" +
    //   "corrupt= 0&" +
    //   "key=9254A152&" +
    //   "event=started&" +
    //   "numwant= 200&" +
    //   "compact=1&" +
    //   "no_peer_id=1&" +
    //   "supportcrypto=1&" +
    //   "redundant=0&"
  );
  // console.log(response)
  expect(response.statusCode).toBe(200);
});
test("Testing root path", async () => {
  const response: any = await request(app).get("/");
  expect(response.statusCode).toBe(404);
});
