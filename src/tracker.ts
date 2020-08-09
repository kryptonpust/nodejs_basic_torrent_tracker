import express from "express";
import findTorrent from "./middleware/findTorrent";
import Validator from "./middleware/validator";
const bencode = require("bencode");
import Database from "./database";
import HandleStarted from "./response/handleStarted";
import BaseHandler from "./response/baseHandler";

import { Torrent, Peer, Event } from "./interfaces";
import HandleStopped from "./response/handleStopped";
import HandleCompleted from "./response/handleCompleted";

const router = express.Router();
const database = Database.getInstance();
router.use(Validator);
router.use(findTorrent);
router.get("/", (req: any, res) => {
  console.log("tracker",req.ip)
  res.setHeader("Content-Type", "text/plain");
  if (req.error) {
    return res.send(bencode.encode({ "failure reason": req.error }));
  }
  const { event } = req.query;
  let base: BaseHandler;
  if (event === Event[Event.started]) {
    base = new HandleStarted(req.query, req.torrent);
  } else if (event === Event[Event.completed]) {
    base = new HandleCompleted(req.query, req.torrent);
  } else if (event === Event[Event.stopped]) {
    base = new HandleStopped(req.query, req.torrent);
  } else {
    base=new BaseHandler(req.query,req.torrent)
  }
  // console.log(base);
  // console.log("data", base.getResponse());
  return res.send(bencode.encode(base.getResponse()));
});

export default router;
