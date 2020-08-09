import { Torrent } from "../interfaces";
import DB from "../database";

export default (req: any, res: any, next: () => void) => {
    const {info_hash}=req.query
    const torrent:Torrent=DB.getInstance().getTorrentFromHash(info_hash)
    if(!torrent)
    {
        console.log(`${req.ip}: NO TORRENT FOUND`)
        console.log("REQUEST",req.query)
        req.error="No TORRENT FOUND"
        return next()
    }
    req.torrent = torrent;
    next();
  };