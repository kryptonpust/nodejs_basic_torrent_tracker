import {
  PeerListResponse,
  TrackerRequest,
  Torrent,
  TrackerResponse,
} from "../interfaces";
import DB from "../database";

export default class BaseHandler {
  protected database: DB;
  protected request: TrackerRequest;
  protected torrent: Torrent;
  protected response: TrackerResponse;
  constructor(request: TrackerRequest, torrent: Torrent) {
    this.database = DB.getInstance();
    this.request = request;
    this.torrent = torrent;
    this.response = {
      interval: 30,
      "tracker id": this.request.trackerid,
      complete: 0,
      incomplete: 0,
      peers: [],
    };
  }

  getResponse(): TrackerResponse {
    const peers = this.getPeersForTorrent();
    return (this.response = {
      ...this.response,
      complete: this.torrent.completed,
      incomplete: peers.length,
      peers: peers,
    });
  }

  getBufferedPeers(peerlist: PeerListResponse[]): Buffer {
    // peerlist.push({ peer_id: "asdf", ip: "192.168.10.104", port: 8686 });
    const result: Buffer[] = [];
    for (let peer of peerlist) {
      const buff = Buffer.alloc(6);
      const ip = peer.ip.split(".");
      for (let i = 0, len = ip.length; i < len; i++) {
        buff.writeUIntBE(parseInt(ip[i]), i, 1);
      }
      buff.writeUInt16BE(peer.port, ip.length);
      result.push(buff);
    }
    return Buffer.concat(result);
  }

  getPeersForTorrent(): PeerListResponse[] | String | Buffer {
    if (this.request.numwant !== 0) {
      const peers = this.database.getPeerByTorrentId(
        this.torrent.id,
        this.request.numwant,
        this.request.left === 0 ? "DESC" : "ASC",
        this.request.no_peer_id
      );
      // return peers;
      return this.request.compact === true
        ? this.getBufferedPeers(peers)
        : peers;
    } else {
      return [];
    }
  }
}
