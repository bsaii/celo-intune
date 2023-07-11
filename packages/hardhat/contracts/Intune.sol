// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Intune
 * @notice mint and trade unique songs represented as non-fungible tokens (NFTs).
 */
contract Intune is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _totalSongsCounter;
    uint256 internal _totalLikedSongs;
    uint256 internal mintFee;

    struct Song {
        address payable owner;
        uint256 likes;
        uint256 comments;
        uint256 price;
        bool isListed;
    }

    struct Comment {
        address user;
        string comment;
    }

    mapping (uint256 => Song) internal songs;
    mapping (address => uint256) private earnings;
    mapping (address => mapping (uint256 => uint256)) internal likedSongs;
    mapping (address => mapping (uint256 => bool)) internal _liked;
    mapping(uint256 => mapping(uint256 => Comment)) internal songComments;

    // Modifer to allow users to like song once
    modifier liked(address user, uint256 songId) {
        require(!_liked[user][songId], "User already liked the song");
        _;
    }

    event LikedSong(uint256 indexed songId, address user, string comment);
    event earningsWithdrawn(address indexed owner, uint256 amount);
    event SongListed(uint256 indexed songId, uint256 price);
    event SongPurchased(uint256 indexed songId, address buyer);

    /**
     * @dev Constructor for initial funding and mintingFee
     */
    constructor() payable ERC721("Intune", "ITK") {
        require(
            msg.value > 1 ether,
            "More than 1 ether initial funding is required"
        );
        mintFee = 0.35 ether;
    }

    /**
     * @dev Get the amount it costs to mint a song
     * @return _amt
     */
    function getMintFee() public view returns (uint256 _amt) {
        return mintFee;
    }

    /**
     * @dev Mints a song as an NFT
     * @param uri IPFS link to the song
     * @param stableTokenAddress The contract address of CELO stable token
     */
    function mintSong(string memory uri, address stableTokenAddress) public payable {
        require(bytes(uri).length > 15, "Invalid URI");

        uint256 songId = _totalSongsCounter.current();
        _totalSongsCounter.increment();
        songs[songId] = Song(payable(msg.sender), 0, 0, 0, false);

        // Pay to mint song
        bool success = IERC20(stableTokenAddress).transferFrom(
            msg.sender,
            owner(),
            mintFee
        );
        require(success, "Payment failed for mint fee");

        // Mint song
        _safeMint(msg.sender, songId);
        _setTokenURI(songId, uri);
    }

    /**
     * @dev Retrieve the newly created song.
     * @param songId The token Id of the minted song
     * @return owner The owner of the song
     * @return likes The overall count of likes received by the song from users
     * @return comments The overall count of comments received by the song from users
     * @return price The price the song was listed for sale at
     * @return isListed Is the song listed for sale
     */
    function getSong(
        uint256 songId
    ) public view returns (
        address owner, 
        uint256 likes, 
        uint256 comments, 
        uint256 price, 
        bool isListed
        ) {
        // Song has been minted
        require(_exists(songId), "Song has not been minted");

        return (
            songs[songId].owner, 
            songs[songId].likes, 
            songs[songId].comments, 
            songs[songId].price, 
            songs[songId].isListed
            );
    }

    /**
    * @dev Get all minted songs on the platform
    * @return Song[] Array of all the minted songs
    */
    function getAllSongs() public view returns (Song[] memory) {
    uint256 totalSongs = totalSupply();
    Song[] memory allSongs = new Song[](totalSongs);

    for (uint256 songId = 0; songId < totalSongs; songId++) {
        address owner;
        uint256 likes;
        uint256 comments;
        uint256 price;
        bool isListed;
        (owner, likes, comments, price, isListed) = getSong(songId);
        allSongs[songId] = Song(payable(owner), likes, comments, price, isListed);
    }

    return allSongs;
}

    /**
     * @dev Enable users to show their appreciation for a song by liking it.
     * @param songId The id of the minted song
     * @param stableTokenAddress The contract address of CELO stable token
     */
    function likeSong(
        uint256 songId,
        string memory comment,
        address stableTokenAddress
    ) public payable liked(msg.sender, songId) {
        // Song has been minted
        require(_exists(songId), "Song has not been minted");

        // Owner can't like song
        require(msg.sender != ownerOf(songId), "Owner can't like song");

        // Make payment
        bool success = IERC20(stableTokenAddress).transferFrom(
            msg.sender,
            address(this),
            0.15 ether
        );
        require(success, "Failed to like song. Payment failed");

        // Update owner earnings
        earnings[ownerOf(songId)] = earnings[ownerOf(songId)] + 0.15 ether;

        // increment the number of likes
        songs[songId].likes++;

        // add song to the user's liked songs
        likedSongs[msg.sender][_totalLikedSongs] = songId;
        _totalLikedSongs++;

        // Mark the song as liked by the user
        _liked[msg.sender][songId] = true;

        // Add comment (if provided)
        if (bytes(comment).length != 0) {
            Comment memory newComment = Comment({
            user: msg.sender,
            comment: comment
            });
            songComments[songId][songs[songId].comments] = newComment;
            songs[songId].comments++;
        }

        emit LikedSong(songId, msg.sender, comment);

    }

    /**
    * @dev Get all songs liked by a user
    * @return uint256[] Array of minted song token IDs liked by the user
    */
    function getAllLikedSongs() public view returns (uint256[] memory) {
        // the total number of liked songs
        uint256 total = _totalLikedSongs;
        // array with a size equal to the total number of liked songs
        uint256[] memory likedSongIds = new uint256[](total);
        //  retrieve each liked song's token ID
        for (uint256 i = 0; i < total; i++) {
            likedSongIds[i] = likedSongs[msg.sender][i];
        }

        return likedSongIds;
    }

    /**
    * @dev Get all comments left for a song
    * @param songId The ID of the song
    * @return Comment[] Array of comments left for the song
    */
    function getAllCommentsForSong(uint256 songId) public view returns (Comment[] memory) {
        Comment[] memory allComments = new Comment[](songs[songId].comments);
        mapping(uint256 => Comment) storage comments = songComments[songId];

        for (uint256 i = 0; i < songs[songId].comments; i++) {
            allComments[i] = comments[i];
        }

        return allComments;
    }

    /**
     * @dev Returns the earnings made on a song
     * @return _amt Total amount earned
     */
    function getEarnings(address _owner) public view returns (uint256 _amt) {
        return earnings[_owner];
    }

    /**
     * @dev Withdraw earnings earn from songs
     * @param stableTokenAddress The contract address of CELO stable token
     */
    function withdrawEarnings(address stableTokenAddress) public payable {
        // Owner must have earnings to withdraw
        require(earnings[msg.sender] > 0, "You don't have any earnings");

        // Transfer all earnings to owner
        bool success = IERC20(stableTokenAddress).transfer(
            payable(msg.sender),
            earnings[msg.sender]
        );
        require(success, "Failed to withdraw earnings");

        // set earnings to 0
        earnings[msg.sender] = 0;

        emit earningsWithdrawn(msg.sender, earnings[msg.sender]);
    }

    /**
     * @dev List a song for sale
     * @param songId The ID of the song
     * @param price The price in ERC20 tokens to list the song for
     */
    function listSongForSale(uint256 songId, uint256 price) public {
        require(_exists(songId), "Song has not been minted");
        require(msg.sender == ownerOf(songId), "Not owner, can't list for sale");
        require(!songs[songId].isListed, "Song is already listed");
        
        // Transfer the token ownership to the contract
        transferFrom(msg.sender, address(this), songId);

        // song details are updated
        songs[songId].price = price;
        songs[songId].isListed = true;

        emit SongListed(songId, price);
    }

     /**
     * @dev Get all the listed songs
     * @return uint256[] Array of song IDs that are listed for sale
     */
    function getAllListedSongs() public view returns (uint256[] memory) {
        uint256 totalSongs = totalSupply();
        uint256[] memory listedSongs = new uint256[](totalSongs);
        uint256 listedCount;
        // iterate and collect the IDs of the listed songs
        for (uint256 i = 0; i < totalSongs; i++) {
            if (songs[i].isListed) {
                listedSongs[listedCount] = i;
                listedCount++;
            }
        }

        uint256[] memory result = new uint256[](listedCount);
        for (uint256 i = 0; i < listedCount; i++) {
            result[i] = listedSongs[i];
        }

        return result;
    }

    /**
     * @dev Purchase a listed song using ERC20 tokens
     * @param songId The ID of the song to purchase
     * @param stableTokenAddress The contract address of CELO stable token
     */
    function purchaseSong(uint256 songId, address stableTokenAddress) public payable {
        require(_exists(songId), "Song has not been minted");
        require(songs[songId].isListed, "Song is not listed for sale");

        Song storage song = songs[songId];
        uint256 salePrice = song.price;

        _approve(msg.sender, songId);

        // Transfer the token ownership to the buyer
        transferFrom(address(this), msg.sender, songId);

        address seller = song.owner;
        bool success = IERC20(stableTokenAddress).transferFrom(msg.sender, seller, salePrice);
        require(success, "Failed to purchase song. Payment failed");

        song.isListed = false;
        song.owner = payable(msg.sender);
        song.price = 0;

        emit SongPurchased(songId, msg.sender);
    }



    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 songId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, songId, batchSize);
    }

    function _burn(uint256 songId) internal override(ERC721, ERC721URIStorage) {
        super._burn(songId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
