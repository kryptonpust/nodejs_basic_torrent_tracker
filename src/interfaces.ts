import { Integer } from "better-sqlite3";

export interface Torrent {
  id: number;
  hash: string;
  name: string;
  size: number;
  completed: number;
}
export interface Peer {
  id: number;
  t_id: number;
  peer_id: string;
  ip: string;
  port: number;
}
export interface TrackerRequest {
  info_hash: string;
  peer_id: string ;
  port: number;
  uploaded: number;
  downloaded: number;
  left: number;
  compact: boolean;
  no_peer_id: boolean;
  event: Event;
  ip: string;
  numwant: number;
  key?: string;
  trackerid: string;
}

export interface TrackerErrorResponse{
    'failure reason':string
}
export interface TrackerResponse{
    'warning message'?:string,
    interval:number,
    'min interval'?:number,
    'tracker id':string,
    complete:number,
    incomplete:number,
    peers: Array<PeerListResponse> | String|Buffer
}

export interface PeerListResponse{
    peer_id?:string
    ip:string
    port:number
}
export enum Event {
  started,
  stopped,
  completed,
}
