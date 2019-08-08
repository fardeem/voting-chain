## Problem Statement

You have to design a simple blockchain and use that block chain on a electronic voting system.

**Main Components**

There will be two segment of the system.

1. Voting System: Where voter have to register and nominate another register users for a predefined position. Register voters will able to cast vote for the nominated candidate. An system admin will announce the election time and cutoff time. After the cutoff time no vote can be cast. After the election time is over, result will be available to all register user.
2. Block Chain: each casted vote should be considered a block. Blocks should be encrypted.

**Minimum Requirement**

Create the voting system with user registration and nomination.

**Main problem**

Integrating your blockchain with the vote casting.

**Good to have**

A good amount of analytics on the election
Detect any anomaly in the blockchain

## Test scenarios

Module:

- Registration:

  - [x] Verify user id is unique or not.
  - [x] Check user id can’t be empty.
  - [x] Verify password field can’t be empty.
  - [x] Verify all link in that page is working or not.

- Log in :

  - [x] Verify user id or password field can’t be empty.
  - [x] Check with wrong user id and correct password. Verify it doesn’t work.
  - [x] Check with correct user id and wrong password. Verify it doesn’t work.

- Reset password:

  - [x] Check user can change password.
  - [x] Try to log in using previous password.

- Home:

  - [x] Verify user can see all scheme correctly.
  - [x] Verify by navigate to details page user can see all candidates name correctly.
  - [x] Verify user can add 1 or more candidates to a single scheme.
  - [x] Verify user can add 1 or more candidates to 1 or multiple scheme.
  - [x] Verify user can not remove an already added candidate from any scheme or any individual category.
  - [x] Verify user can not add any candidate to an already ended scheme.

- Voting:

  - [x] Verify 1 or more scheme for voting can run at the same time.
  - [x] For a single scheme, Verify user can vote only 1 candidate at a time.
  - [x] Verify user can not modify already casted vote.
  - [x] Verify user can cast vote simultaneously to various scheme.
  - [x] Verify user can not cast vote for him/herself.
  - [x] Verify can not cast vote to already closed scheme.
  - [ ] Verify user can see already casted vote count for any specific candidate of any scheme/category.

- Super admin:

  - [x] Can create multiple scheme.
  - [x] Can not edit already closed scheme.
  - [x] Can not delete already closed scheme.
  - [x] Can not change start date of an already started scheme.
  - [ ] Can not create 2 or more scheme with same name.
  - [x] Can not have 2 or more category having same name in a single scheme.
  - [ ] Verify super admin can take decision of selecting candidate for a scheme which is hold.
  - [ ] Verify super admin can not take decision of selecting candidate for a scheme which is not hold.

- Edge case:
- [ ] If 1 user have same 5 vote count for 1 category and 8 vote for 2 category then he/she will be elected for category 2.
- [ ] If 1 user have same 5 vote count for 1 category and 5 vote for 2 category then the winner selection will be Hold and depends on the decesion of super admin( Business decision)
