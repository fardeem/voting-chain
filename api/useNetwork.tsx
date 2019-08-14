import { useState, useEffect } from 'react';
import swarm from 'webrtc-swarm';
import signalhub from 'signalhub';

import { Vote, Block } from './blockchain';

const hub = signalhub('blockchain-swarm', ['http://localhost:8080']);

interface PeerExchangeFormat {
  infoType: 'VOTE' | 'BLOCK';
  value: Vote | Block;
}

export default function useNetwork(
  voteSub: Function,
  blockSub: Function
): [Object, (vote: Vote) => void, (blocks: Block[]) => void] {
  const [peers, setPeers] = useState({});

  function sendVote(vote: Vote) {
    voteSub(vote); // Send to self

    Object.values(peers).forEach(peer => {
      // @ts-ignore
      peer.send(JSON.stringify({ infoType: 'VOTE', value: vote }));
    });
  }

  function sendBlock(blocks: Block[]) {
    blockSub(blocks);

    Object.values(peers).forEach(peer => {
      // @ts-ignore
      peer.send(JSON.stringify({ infoType: 'BLOCK', value: blocks }));
    });
  }

  useEffect(() => {
    const sw = swarm(hub);

    sw.on('peer', function(peer, id) {
      setPeers(peers => ({ ...peers, [id]: peer }));

      console.log('connected to a new peer:', id);
      console.log('total peers:', sw.peers.length);

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

    sw.on('disconnect', function(_, id: string) {
      setPeers(peers => {
        var newPeerList = Object.assign({}, peers);
        delete newPeerList[id];
        return newPeerList;
      });
    });

    sw.on('close', () => {
      setPeers({});
    });

    return () => {
      sw.close();
    };
  }, []);

  return [peers, sendVote, sendBlock];
}
