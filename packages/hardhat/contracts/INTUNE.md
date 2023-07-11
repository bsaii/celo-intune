# Intune Smart Contract Documentation

## Overview

The Intune smart contract is a decentralized application (dApp) developed on the Ethereum blockchain. It enables users to mint and trade unique songs represented as non-fungible tokens (NFTs). The contract incorporates various functionalities such as minting songs, liking songs, listing songs for sale, purchasing listed songs, and managing earnings.

## Contract Details

- Contract Name: Intune
- Contract Address: 0x1672Da9999363A71C7Eba8573912587C6CEEcDD2 (as of [Deployment Date])

## Features and Functionalities

1. Minting Songs as NFTs
2. Liking Songs
3. Listing Songs for Sale
4. Purchasing Listed Songs
5. Managing Earnings

## Dependencies

The Intune smart contract utilizes the following external libraries and contracts:

- OpenZeppelin Contracts v4.3.0

  - ERC721.sol
  - ERC721Enumerable.sol
  - ERC721URIStorage.sol
  - Ownable.sol

- ERC20 Token Contract
  - [cUsdTokenAddress]

## Contract Structure

The Intune smart contract is structured as follows:

### Inherited Contracts

- ERC721: Provides basic functionality for the ERC721 token standard.
- ERC721Enumerable: Extends ERC721 to support enumerable token collections.
- ERC721URIStorage: Extends ERC721 to store metadata URIs for each token.
- Ownable: Implements ownership functionality with a single owner.

### State Variables

- `_totalSongsCounter`: Counter to keep track of the total number of minted songs.
- `_totalLikedSongs`: Total number of songs liked by users.
- `mintFee`: The fee required for minting a new song.

### Structs

- `Song`: Represents a song NFT, including information such as the owner, number of likes, number of comments, price, and listing status.
- `Comment`: Stores the user address and comment text for a specific song.

### Mappings

- `songs`: Maps song IDs to the `Song` struct.
- `earnings`: Maps user addresses to their earnings from song interactions.
- `likedSongs`: Maps user addresses to their liked songs.
- `_liked`: Maps user addresses and song IDs to track whether a user has liked a song.
- `songComments`: Maps song IDs to user comments.

### Events

- `LikedSong`: Triggered when a user likes a song and leaves a comment.
- `earningsWithdrawn`: Triggered when a user withdraws their earnings.
- `SongListed`: Triggered when a song is listed for sale.
- `SongPurchased`: Triggered when a song is successfully purchased.

### Modifiers

- `liked`: Modifier to ensure that a user can only like a song once.

### Constructor

- Initializes the contract, requires an initial funding of at least 1 ether, and sets the minting fee.

### Core Functions

1. `mintSong`: Allows users to mint a new song as an NFT.
2. `getSong`: Retrieves the details of a specific song by its token ID.
3. `likeSong`: Enables users to like a song, leave a comment, and make a payment in ERC20 tokens.
4. `getAllLikedSongs`: Retrieves the token IDs of all songs liked by a user.
5. `getAllCommentsForSong`: Retrieves all comments left for a specific song.
6. `getEarnings`: Retrieves the earnings of a user from song interactions.
7. `withdrawEarnings`: Allows users to withdraw their earnings.
8. `listSongForSale`: Enables the owner of a song to list it for sale at a specific price.
9. `getAllListedSongs`: Retrieves the token IDs of all songs listed for sale.
10. `purchaseSong`: Allows users to purchase a song listed for sale using ERC20 tokens.

### ERC721 Overrides

The Intune contract includes necessary overrides and implementations for the ERC721 standard and its extensions (ERC721Enumerable and ERC721URIStorage).

## Usage

The Intune contract can be interacted with through various methods and external applications:

- Users can call the provided functions to mint songs, like songs, list songs for sale, purchase listed songs, withdraw earnings, and retrieve song details.

- The contract can be integrated into decentralized applications (dApps) or marketplaces that utilize NFTs.
- Users can interact with the contract using Ethereum wallets, such as MetaMask, by connecting to the contract's address.

## Security Considerations

- The contract uses the Ownable pattern to ensure that only the contract owner can perform certain actions.
- The `liked` modifier prevents users from liking a song multiple times.
- Care should be taken when handling user interactions and validating inputs to prevent potential vulnerabilities.
- The contract's dependencies should be verified and audited to ensure their security and reliability.

## Conclusion

The Intune smart contract provides a decentralized platform for minting, trading, and interacting with song NFTs. Users can mint unique songs, like their favorite songs, list songs for sale, and purchase listed songs using ERC20 tokens. The contract also tracks and manages user earnings from song interactions. By utilizing the Intune contract, users can engage in a vibrant community of music enthusiasts and explore the world of blockchain-based digital music ownership.
