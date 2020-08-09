import { TrackerRequest, TrackerResponse, Torrent, Peer } from "../interfaces";
import BaseHandler from "./baseHandler";
import DB from "../database";

export default class HandleStarted extends BaseHandler {
  constructor(request: TrackerRequest, torrent: Torrent) {
    super(request, torrent);
    this.database.insertOrReplacePeer(
      this.torrent.id,
      this.request.peer_id,
      this.request.ip,
      this.request.port,
      this.request.left
    );
  }
  getResponse(): TrackerResponse {
    return super.getResponse()
  }
}
