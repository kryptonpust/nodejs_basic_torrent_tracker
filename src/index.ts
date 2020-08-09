import * as fs from "fs";
import bencode from "bencode";
import app from "./app";
import DB from "./database";
import { PeerListResponse } from "./interfaces";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 8686;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running in PORT ${PORT}`);
});
const data = fs.readFileSync(__dirname + "/../store/demo.torrent");
const dedata = bencode.decode(data);

const peerlist: PeerListResponse[] = [
  { peer_id: "abckd", ip: "192.168.10.103", port: 8989 },
  { peer_id: "abckd", ip: "192.168.10.103", port: 8686 },

];

// const result: Buffer[] = [];
// for (let peer of peerlist) {
//   const buff = Buffer.alloc(6);
//   const ip = peer.ip.split(".");
//   for (let i = 0,len=ip.length; i < len; i++) {
//     buff.writeUIntBE(parseInt(ip[i]), i, 1);
//   }
//   buff.writeUInt16BE(peer.port,ip.length)
//   result.push(buff)
// }

// console.log(result)
// console.log(Buffer.concat(result))