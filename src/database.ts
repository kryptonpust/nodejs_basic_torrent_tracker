import Database from "better-sqlite3";
import { Peer, Torrent, PeerListResponse } from "./interfaces";
const fs = require("fs");

export default class DB {
  public static DBNAME = __dirname + "/db.sqlite";
  private localdb: Database.Database;
  private flag = false;
  private static _instance: DB = new DB();

  public static getInstance(): DB {
    return DB._instance;
  }
  constructor() {
    if (DB._instance) {
      throw new Error(
        "Error: Instantiation failed: Use SingletonClass.getInstance() instead of new."
      );
    }
    DB._instance = this;
    if (fs.existsSync(DB.DBNAME)) {
      this.flag = true;
    }
    try {
      this.localdb = new Database(DB.DBNAME);//, { verbose: console.log });

      if (!this.flag) {
        this.localdb
          .prepare(
            `CREATE TABLE "torrents" (
               "id"	INTEGER,
               "hash"	TEXT,
               "name"  TEXT DEFAULT "TORRENT",
               "size"	INTEGER DEFAULT 0,
               "completed"	INTEGER DEFAULT 0,
               PRIMARY KEY("id")
           );`
          )
          .run();
        this.localdb
          .prepare(
            `CREATE TABLE "peers" (
               "id"	INTEGER,
               "t_id"	INTEGER,
               "peer_id" TEXT,
               "ip"	TEXT,
               "port"	INTEGER,
               "left" INTEGER DEFAULT 0,
               FOREIGN KEY("t_id") REFERENCES "torrents"("id") ON DELETE CASCADE,
               PRIMARY KEY("id")
           );`
          )
          .run();

        this.localdb
          .prepare(`CREATE UNIQUE INDEX idx_peers on peers(t_id,ip)`)
          .run();
        this.localdb
          .prepare(
            "INSERT INTO torrents(hash,name,size) VALUES ('788cadf362e61d201deacb6a9a51c3aea60631fa','Windows 10','5832765440')" //Demo torrent
          )
          .run();
      }

      this.localdb.prepare("DELETE FROM peers").run();
      console.log("DATABASE READY");
    } catch (error) {
      throw error;
    }
  }

  public getPeerByTorrentId(
    t_id: number,
    limit: number,
    order: "ASC" | "DESC",
    no_peer_id: boolean
  ): Array<PeerListResponse> {
    if (typeof t_id !== "number") {
      t_id = parseInt(t_id);
    }
    if (typeof limit !== "number") {
      limit = parseInt(limit);
    }
    if (typeof order !== "string") {
      order = "ASC";
    }
    if (typeof no_peer_id === "string") {
      no_peer_id = no_peer_id==='1'?true:false;
    }
    return this.localdb
      .prepare(
        no_peer_id === true
          ? `SELECT ip,port FROM peers WHERE t_id=? ORDER BY 'left' ${
              order ? order : "ASC"
            } LIMIT ?`
          : `SELECT peer_id,ip,port FROM peers WHERE t_id=? ORDER BY 'left' ${
              order ? order : "ASC"
            } LIMIT ?`
      )
      .all(t_id, limit);
  }

  public insertOrReplacePeer(
    t_id: number,
    peer_id: string,
    ip: string,
    port: number,
    left: number
  ) {
    if (typeof t_id !== "number") {
      t_id = parseInt(t_id);
    }

    if (typeof port !== "number") {
      port = parseInt(port);
    }
    if (typeof left !== "number") {
      left = parseInt(left);
    }
    this.localdb
      .prepare(
        `REPLACE INTO peers(t_id,peer_id,ip,port,left) VALUES (?,?,?,?,?)`
      )
      .run(t_id, peer_id, ip, port, left);
  }

  public getTorrentFromHash(hash: string): Torrent {
    return this.localdb
      .prepare(`SELECT * from torrents where hash like ?`)
      .get(hash);
  }

  public removeStoppedPeer(t_id: number, peer_id: string) {
    if (typeof t_id !== "number") {
      t_id = parseInt(t_id);
    }

    this.localdb
      .prepare(`DELETE from peers where t_id=? AND peer_id=?`)
      .run(t_id, peer_id);
  }

  public updateCompleted(t_id: number) {
    if (typeof t_id !== "number") {
      t_id = parseInt(t_id);
    }

    this.localdb
      .prepare(`UPDATE torrents set completed=completed+1 WHERE id=?`)
      .run(t_id);
  }
}
