![](project-logo.png)

## Introducion

Voting Chain lets users in its system to nominate other users to various elections and vote for nominated users in various elections. An admin can create elections with various positions. Results are computed in such a way so that a user is announced winner to no more than one position. The main feature of this app is that all votes are stored on a blockchain structure and this blockchain is stored locally on every client and propagated peer-to-peer.

This project came out of a problem posed at Falguni Code Sprint 2019, a 36-hour hackathon hosted at ULAB, Dhaka, Bangladesh. I was not happy with the project I build there so I decided to redo it during my spare time. It was a great decision as I ended up learning lots of things and building this on my own was quite a lot of fun.

The following document outlines the tech stack, technical details of how the entire system works, implementation details for the blockchain and peer-to-peer (P2P) system, and "favorite" pieces of code that I wrote for this project.

## Tech stack:

- [Next.js](https://nextjs.org)
- Firebase
- [Tailwind.css](https://tailwindcss.com/docs/) (with other [PostCSS](https://postcss.org/) plugins)
- [Typescript](https://typescriptlang.org)
- [Jest](https://jestjs.io)

I picked Next.js because I was quite comfortable with React and using Next meant I got a really good routing api out of the box. Firebase was used for authentication and storing user data, elections list and nominations, however, all vote related information was stored on the blockchain.

**Jest**
This was my first time writing tests of any kind and so I picked Jest as everyone on the internet recommended it. I have very few tests in my codebase and they only test complicated units. I am planning on learning how to test UI since I found manually testing things to be really error prone and time consuming.

**Tailwind.css**
I have always used [Harry Robert's](https://csswizardry.com/) ITCSS/BEM methodology when writing CSS. However, during this project, I found myself being slowed down having to think of semantic classnames and think of when to make an object and when to make a component. To address this frustration of not being able to move quickly and change things, I started looking into [Atomic CSS](https://acss.io/). Later, after listening to [Jeffrey Way on Fullstack Radio](http://www.fullstackradio.com/111) I decided to use Tailwind.css.

Overall, I like the utility-first css approach of tailwind, however without adhering to its "extracting components" principle and without properly configuring the `tailwind.config.js` file, I found my html quickly becoming a class soup. I found [Harry Robert's advice on modular css](https://csswizardry.com/2015/03/can-css-be-too-modular/) to be helpful when taking this modular/atomic approach to authoring css.

**Typescript**
I had started the project with the opinion that types are too verbose and unnecessary. But, when I was trying to write the [DataProvider Component](https://github.com/fardeemmunir/voting-chain/blob/master/api/DataProvider.tsx), which was responsible for pulling in data from Firebase and exposing it to other components, I found Typescript's interface definitions and typechecking to be a God send. It not only threw type errors in real that saved me a lot of debugging time but also gave me confidence that I wouldn't mutate a data structure in an unexpected way. Furthermore, Next.js out of the box typescript support made incrementally adopting it a breeze.

Technical details:
How the blockchain works
Crypto
Hashing
Miner worker

How the network works
Socket
Local cache

Resolving holded elections

Data provider
Blockchain
Results generating code
