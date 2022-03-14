// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Decentragram {
  string public name = 'Decentragram';

  // Store images
  uint public imageCount = 0;
  mapping(uint => Image) public images;

  struct Image {
    uint id;
    string hash;
    string description;
    uint tipAmount;
    address author;
    uint tipTotal;
  }

  event ImageCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address author,
    uint tipTotal
    );

  event imageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address author,
    uint tipTotal
    );


  // Create images
  function uploadImage(string memory _imgHash, string memory _description) public {
    // Require description not empty
    require(bytes(_description).length > 0);

    // Require image hash not empty
    require(bytes(_imgHash).length > 0);

    // Require msg.sender address exists
    require(msg.sender!=address(0));

    // Increment image Id
    imageCount++;

    // Add image to contract
    images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender, 0);

    // Trigger an event
    emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender, 0);

  } 

  // Tip images
  function tipImageOwner(uint _id) public payable {
    // Make sure the id is valid
    require(_id > 0 && _id <= imageCount);

    // Fetch the image
    Image memory _image = images[_id];

    //Fetch the author and make payable
    address _author = _image.author;

    // Pay the author
    payable(_author).transfer(msg.value);

    // Update tip amount
    _image.tipAmount = _image.tipAmount + msg.value;

    // Update the tip total
    _image.tipTotal++;

    // Update the image
    images[_id] = _image;

    // Emit the event
    emit imageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author, _image.tipTotal);
  }
}