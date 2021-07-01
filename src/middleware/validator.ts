import { TrackerRequest } from "../interfaces";

export default (req: any, res: any, next: () => void) => {
  console.log("Validator")
  console.log(req.ip)
  const {
    info_hash,
    peer_id,
    port,
    uploaded,
    downloaded,
    left,
    compact,
    no_peer_id,
    event,
    ip,
    numwant,
    key,
    trackerid,
  }: TrackerRequest = req.query;
  if (!info_hash) {
    console.log(`${req.ip}: NO HASH FOUND`);
    console.log("REQUEST", req.query);
    req.error = "No Hash FOUND";
    return next();
  }
  req.query.info_hash = byteSequenceParser(info_hash).toString("hex");

  if (!port) {
    console.log(`${req.ip}: NO PORT FOUND`);
    console.log("REQUEST", req.query);
    req.error = "No Port FOUND";
    return next();
  }

  if (!peer_id) {
    console.log(`${req.ip}: NO Peer_id FOUND`);
    console.log("REQUEST", req.query);
    req.error = "No peer_id FOUND";
    return next();
  }
  if (port && typeof port !== "number") {
    req.query.port = parseInt(port);
  }
  if (uploaded && typeof uploaded !== "number") {
    req.query.uploaded = parseInt(uploaded);
  } else {
    req.query.downloaded = 0;
  }
  if (downloaded && typeof downloaded !== "number") {
    req.query.downloaded = parseInt(downloaded);
  } else {
    req.query.downloaded = 0;
  }
  if (left && typeof left !== "number") {
    req.query.left = parseInt(left);
  } else {
    req.query.left = 0;
  }
  if (compact && typeof compact === "string") {
    req.query.compact = compact === "1" ? true : false;
  } else {
    req.query.compact = false;
  }
  if (no_peer_id && typeof no_peer_id === "string") {
    req.query.no_peer_id = no_peer_id === "1" ? true : false;
  } else {
    req.query.no_peer_id = false;
  }
  if (numwant && typeof numwant !== "number") {
    req.query.numwant = parseInt(numwant);
  } else {
    req.query.numwant = 0;
  }
  if (!ip) {
    req.query.ip = req.ip;
  }
  if (!trackerid) {
    req.query.trackerid = "Xosstracker";
  }
  next();
};

function byteSequenceParser(value: string): Buffer {
  var result = [];
  for (let i = 0; i < value.length; i++) {
    if (value[i] === "%") {
      result.push(parseInt(value[i + 1] + value[i + 2], 16));
      i += 2;
    } else {
      result.push(value.charCodeAt(i));
    }
  }
  return Buffer.from(result);
}
