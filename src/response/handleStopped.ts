import BaseHandler from "./baseHandler";
import DB from "../database";
import { TrackerRequest, Torrent, TrackerResponse } from "../interfaces";

export default class HandleStopped extends BaseHandler {
  constructor(request: TrackerRequest, torrent: Torrent) {
    super(request, torrent);
    this.database.removeStoppedPeer(this.torrent.id, this.request.peer_id);
  }
  getResponse() {
    return super.getResponse()
  }
}
