import { useState, useEffect } from 'react';
import swarm from 'webrtc-swarm';
import signalhub from 'signalhub';

import { Vote, Block } from './blockchain';

const hub = signalhub('blockchain-swarm', ['http://localhost:8080']);

interface PeerExchangeFormat {
  infoType: 'VOTE' | 'BLOCK';
  value: Vote | Block;
}

interface PeerList {
  [key: string]: {
    send: Function;
    on: Function;
    [key: string]: any;
  };
}

export default function useNetwork(
  voteSub: Function,
  blockSub: Function
): [PeerList, (vote: Vote) => void, (blocks: Block[]) => void] {
  const [peers, setPeers] = useState<Partial<PeerList>>({});

  function sendVote(vote: Vote) {
    voteSub(vote); // Send to self

    Object.values(peers).forEach(peer => {
      peer.send(JSON.stringify({ infoType: 'VOTE', value: vote }));
    });
  }

  function sendBlock(blocks: Block[]) {
    blockSub(blocks);

    Object.values(peers).forEach(peer => {
      peer.send(JSON.stringify({ infoType: 'BLOCK', value: blocks }));
    });
  }

  useEffect(() => {
    const sw = swarm(hub);

    sw.on('peer', function(peer, id) {
      setPeers(peers => ({ ...peers, [id]: peer }));

      console.group('swarm-connect');
      console.log('connected to a new peer:', id);
      console.log('total peers:', sw.peers.length);
      console.groupEnd();

      peer.on('data', (data: PeerExchangeFormat) => {
        const { infoType, value } = JSON.parse(data.toString());

        switch (infoType) {
          case 'BLOCK':
            return blockSub(value); // send block
          case 'VOTE':
            return voteSub(value); //send vote
        }
      });
    });

    sw.on('disconnect', function(peer, id: string) {
      console.group('swarm-disconnect');
      console.log('disconnected from peer:', id);
      console.log('total peers:', sw.peers.length);
      console.groupEnd();

      setPeers(peers => {
        var newPeerList = Object.assign({}, peers);
        delete newPeerList[id];
        return newPeerList;
      });
    });
  }, []);

  return [peers, sendVote, sendBlock];
}
