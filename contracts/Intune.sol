// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IntuneToken
 * @dev Turn your music into an NFt and earn tokens
 */
contract IntuneToken is ERC721, ERC721Enumerable, ERC721URIStorage {
    using Counters for Counters.Counter;

    // cUsdToken Address
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;

    Counters.Counter private _totalSongs;
    uint256 internal _totalLikedSongs;
    uint256 internal mintFee;

    mapping(uint256 => uint256) internal likes;
    mapping(address => uint256) internal earnings;
    mapping(address => mapping(uint => uint)) internal likedSongs;
    mapping(address => mapping(uint256 => bool)) internal _liked;

    // Modifer to allow users to like song once
    modifier liked(address _user, uint256 _tokenId) {
        require(!_liked[_user][_tokenId], "User already liked the song");
        _;
    }

    constructor() payable ERC721("IntuneToken", "ITK") {
        require(
            msg.value > 1 ether,
            "More than 1 ether initial funding is required"
        );
        mintFee = 0.35 ether;
    }

    /**
     * @dev Mints a song as an NFT
     * @param uri: ipfs link to the song
     */
    function mintSong(string memory uri) public payable {
        require(bytes(uri).length > 15, "Invalid URI");
        require(msg.value == mintFee, "Mint Fee of 0.35 ETH is required");

        uint256 tokenId = _totalSongs.current();
        _totalSongs.increment();
        likes[tokenId] = 0;

        // Pay to mint song
        bool success = IERC20(cUsdTokenAddress).transferFrom(
            msg.sender,
            address(this),
            mintFee
        );
        require(success, "Payment failed for mint fee");

        // Mint song
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
    }

    /**
     * @dev Get the likes of a minted song
     * @param tokenId: the token Id of the minted song
     * @return _likes
     */
    function getLikes(uint256 tokenId) public view returns (uint256 _likes) {
        // Song has been minted
        require(_exists(tokenId), "Song has not been minted");

        return likes[tokenId];
    }

    /**
     * @dev Allow user to like a song
     * @param tokenId: the id of the minted song
     */
    function likeSong(uint256 tokenId)
        public
        payable
        liked(msg.sender, tokenId)
    {
        require(msg.value == 0.15 ether, "Can't like song with 0 ETH");

        // Song has been minted
        require(_exists(tokenId), "Song has not been minted");

        // Owner can't like song
        require(msg.sender != _ownerOf(tokenId), "Owner can't like song");

        // Make payment
        bool success = IERC20(cUsdTokenAddress).transferFrom(
            msg.sender,
            address(this),
            0.15 ether
        );
        require(success, "Failed to like song. Payment failed");

        // Add amount to owner earnings
        earnings[_ownerOf(tokenId)] = earnings[_ownerOf(tokenId)] + 0.15 ether;

        // increment the number of likes
        likes[tokenId] = likes[tokenId] + 1;

        // add song to the user's liked songs
        likedSongs[msg.sender][_totalLikedSongs] = tokenId;
        _totalLikedSongs++;

        _liked[msg.sender][tokenId] = true;
    }

    /**
     * @dev The total number of songs liked by a user
     * @return total
     */
    function totalLikedSongs() public view returns (uint256 total) {
        return _totalLikedSongs;
    }

    /**
     * @dev Get song liked by a user
     * @param _id: the minted song token id
     * @param _user: the address of the user
     * @return _tokenId Minted song token Id
     */
    function getLikedSongs(uint256 _id, address _user)
        public
        view
        returns (uint256 _tokenId)
    {
        return likedSongs[_user][_id];
    }

    /**
     * @dev Returns the earnings made on a song
     * @param _owner: address of a owner
     * @return _amt Total amount earned
     */
    function getEarnings(address _owner) public view returns (uint256 _amt) {
        return earnings[_owner];
    }

    /**
     * @dev Withdraw earnings earn from songs
     * @param _owner: address of a owner
     * @param _owner: address of the owner of songs
     */
    function withdrawEarnings(address _owner) public payable {
        // Owner must have earnings to withdraw
        require(earnings[_owner] > 0, "You don't have any earnings");

        // Transfer all earnings to owner
        bool success = IERC20(cUsdTokenAddress).transferFrom(
            address(this),
            payable(_owner),
            earnings[_owner]
        );
        require(success, "Failed to withdraw earnings");

        // set earnings to 0
        earnings[_owner] = 0;
    }

    /**
     * @dev Get the amount it costs to mint a song
     * @return _amt
     */
    function getMintFee() public view returns (uint256 _amt) {
        return mintFee;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
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
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
