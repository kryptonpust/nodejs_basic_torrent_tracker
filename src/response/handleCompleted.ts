import { TrackerRequest, TrackerResponse, Torrent, Peer } from "../interfaces";
import BaseHandler from "./baseHandler";
import DB from "../database";

export default class HandleCompleted extends BaseHandler {
  constructor(request: TrackerRequest, torrent: Torrent) {
    super(request, torrent);
    this.database.insertOrReplacePeer(
      this.torrent.id,
      this.request.peer_id,
      this.request.ip,
      this.request.port,
      this.request.left
    );
    this.database.updateCompleted(this.torrent.id);
    
  }
  getResponse(): TrackerResponse {
    const response=super.getResponse()
    response.complete=response.complete+1;
    return response;
  }
}
