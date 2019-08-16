# Voting Chain 🗳🗳🗳

## Table of Contents

- [Introduction](#introduction)
- [Tech Stack](#tech-stack)
  - [Jest](#jest)
  - [Tailwind.css](#tailwind.css)
  - [Typescript](#typescipt)
- [Technical Details](#technical-details)
  - [Blockchain](#the-blockchain)
  - [P2P Network](#p2p-network)
  - [Calculating Results](#calculating-results)
- [Favorite Pieces of Code](#favorite-pieces-of-code)

---

## Introducion

Voting Chain lets users in its system to nominate other users to various elections and vote for nominated users in various elections. An admin can create elections with various positions. Results are computed in such a way so that a user is announced winner to no more than one position. The main feature of this app is that all votes are stored on a blockchain structure and this blockchain is stored locally on every client and propagated peer-to-peer.

This project came out of a problem posed at Falguni Code Sprint 2019, a 36-hour hackathon hosted at ULAB, Dhaka, Bangladesh. I was not happy with the project I build there so I decided to redo it during my spare time. It was a great decision as I ended up learning lots of things and building this on my own was quite a lot of fun.

The following document outlines the tech stack, technical details of how the entire system works, implementation details for the blockchain and peer-to-peer (P2P) system, and "favorite" pieces of code that I wrote for this project.

## Tech Stack

- [Next.js](https://nextjs.org)
- Firebase
- [Tailwind.css](https://tailwindcss.com/docs/) (with other [PostCSS](https://postcss.org/) plugins)
- [Typescript](https://typescriptlang.org)
- [Jest](https://jestjs.io)

I picked Next.js because I was quite comfortable with React and using Next meant I got a really good routing api out of the box. Firebase was used for authentication and storing user data, elections list and nominations, however, all vote related information was stored on the blockchain.

### Jest

This was my first time writing tests of any kind and so I picked Jest as everyone on the internet recommended it. I have very few tests in my codebase and they only test complicated units. I am planning on learning how to test UI since I found manually testing things to be really error prone and time consuming.

### Tailwind.css

I have always used [Harry Robert's](https://csswizardry.com/) ITCSS/BEM methodology when writing CSS. However, during this project, I found myself being slowed down having to think of semantic classnames and think of when to make an object and when to make a component. To address this frustration of not being able to move quickly and change things, I started looking into [Atomic CSS](https://acss.io/). Later, after listening to [Jeffrey Way on Fullstack Radio](http://www.fullstackradio.com/111) I decided to use Tailwind.css.

Overall, I like the utility-first css approach of tailwind, however without adhering to its "extracting components" principle and without properly configuring the `tailwind.config.js` file, I found my html quickly becoming a class soup. I found [Harry Robert's advice on modular css](https://csswizardry.com/2015/03/can-css-be-too-modular/) to be helpful when taking this modular/atomic approach to authoring css.

### Typescript

I had started the project with the opinion that types are too verbose and unnecessary. But, when I was trying to write the [DataProvider Component](https://github.com/fardeemmunir/voting-chain/blob/master/api/DataProvider.tsx), which was responsible for pulling in data from Firebase and exposing it to other components, I found Typescript's interface definitions and typechecking to be a God send. It not only threw type errors in real that saved me a lot of debugging time but also gave me confidence that I wouldn't mutate a data structure in an unexpected way. Furthermore, Next.js out of the box typescript support made incrementally adopting it a breeze.

## Technical Details

### The Blockchain

The steps of how a vote is added to the blockchain is as follows:
The code corresponding to each step is also linked.

1. A user votes for a nominee in an election for a certain position. [_code_](https://github.com/fardeemmunir/voting-chain/blob/ec1654826eb1013bfd6ebeb692dd2d244a9f8399/api/blockchain.tsx#L133)
2. The vote is signed using the users private key. [_code_](https://github.com/fardeemmunir/voting-chain/blob/ec1654826eb1013bfd6ebeb692dd2d244a9f8399/api/blockchain.tsx#L145)
3. The vote is propagated to all the peers in the network. [_code_](https://github.com/fardeemmunir/voting-chain/blob/ec1654826eb1013bfd6ebeb692dd2d244a9f8399/api/blockchain.tsx#L147)
4. Each peer puts the vote in a mining queue. [_code_](https://github.com/fardeemmunir/voting-chain/blob/ec1654826eb1013bfd6ebeb692dd2d244a9f8399/api/blockchain.tsx#L79)
5. A Web Worker watches the mining queue, and processes (finds a hash and nonce) each vote sequentially. [_code_](https://github.com/fardeemmunir/voting-chain/blob/ec1654826eb1013bfd6ebeb692dd2d244a9f8399/api/blockchain.tsx#L106:L125)
6. Once a vote has been mined by a peer, the peer sends that block to all the peers in the network. [_code_](https://github.com/fardeemmunir/voting-chain/blob/ec1654826eb1013bfd6ebeb692dd2d244a9f8399/api/blockchain.tsx#L121)
7. When a peer receives a block, it makes sure the vote contained in that block is valid (as per the spec) and if it is, it adds it to its local blockchain. [_code_](https://github.com/fardeemmunir/voting-chain/blob/ec1654826eb1013bfd6ebeb692dd2d244a9f8399/api/chainUtils.tsx#L87:L143)
8. Once the in-memory blockchain is updated, it is persisted on the client by using localstorage. [_code_](https://github.com/fardeemmunir/voting-chain/blob/ec1654826eb1013bfd6ebeb692dd2d244a9f8399/api/blockchain.tsx#L96:L99)

### The P2P Network

Each client connects to other clients using WebRTC. The connection is made by the [simple-peer](https://www.npmjs.com/package/simple-peer) package and peer discovery is done using the [webrtc-swarm](https://github.com/mafintosh/webrtc-swarm) package.

The network is [exposed as a react hook](https://github.com/fardeemmunir/voting-chain/blob/master/api/useNetwork.tsx). It returns a list of peers, a [function to send votes](https://github.com/fardeemmunir/voting-chain/blob/ec1654826eb1013bfd6ebeb692dd2d244a9f8399/api/useNetwork.tsx#L42:L48) to the network and a [function to send blocks](https://github.com/fardeemmunir/voting-chain/blob/ec1654826eb1013bfd6ebeb692dd2d244a9f8399/api/useNetwork.tsx#L34:L40) (mined votes) to the network. It takes two functions as arguments, which listens for [new votes](https://github.com/fardeemmunir/voting-chain/blob/ec1654826eb1013bfd6ebeb692dd2d244a9f8399/api/useNetwork.tsx#L68) and [new blocks](https://github.com/fardeemmunir/voting-chain/blob/ec1654826eb1013bfd6ebeb692dd2d244a9f8399/api/useNetwork.tsx#L66) from the network respectively.

Clients are connected to a [signalhub server](https://github.com/mafintosh/signalhub) which brokers the webrtc connection between peers. No data flows through the server.

### Calculating Results

In an election, winners are determined in a such a way so that no user wins in more than one position. The following rules also apply:

- Highest voted user in category wins
- If a user has a vote count of 5 in position A an a vote count of 8 for position B, then the user wins in position B.
- if a user has vote count of 5 for both position A and B, then the result for that position is on hold and must be determined by the admin.
- If two or more users in the same position has equal number of votes, then the election goes on hold

On the admin side, for elections on hold, the admin is allowed to make a special vote after the election has ended, to determine the winner.

> Side note: Figuring out an [algorithm](https://github.com/fardeemmunir/voting-chain/blob/master/api/makeResults.tsx) to determine the results was a rewarding, albeit quite painful, programming puzzle. It took two days of thinking and pushed by perseverence. The first intuition for a potential solution was to use a bipartite matching algorithm. This led me down the rabit hole of maximal matching algorithsm and specifically the hungarian algorithm. After playing around with it a bit, I realized that it wouldn't work because it didn't guarantee that the nominee with the most vote in a given position would win. After a lot of hard thinking, some modelling using the bipartite graph led to a pretty good solution.

## Favorite Pieces of Code

- [Data Provider](https://github.com/fardeemmunir/voting-chain/blob/master/api/DataProvider.tsx): This was my first time working with React's Context API so I was quite happy after I was able to integrate everything with Firebase.
- [The Blockchain](https://github.com/fardeemmunir/voting-chain/blob/master/api/blockchain.tsx)
- [The Code that Generates the Results](https://github.com/fardeemmunir/voting-chain/blob/master/api/makeResults.tsx)
- [The P2P Network React Hook](https://github.com/fardeemmunir/voting-chain/blob/master/api/useNetwork.tsx)
- [Function that returns the longest chain of the blockchain](https://github.com/fardeemmunir/voting-chain/blob/eb830f264bf8667e54039543254288054a4b3909/api/chainUtils.tsx#L36:L54) - I get really happy anytime I can use recursion in my code to do things elegant.
