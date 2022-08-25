require("dotenv").config();
const ALCHEMY_URL = process.env.ALCHEMY_URL;
const OWNER_PUBLIC_KEY = process.env.OWNER_PUBLIC_KEY;
const NFTContractAddress = process.env.NFT_CONTRACT_ADDRESS;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ALCHEMY_URL);

const contract = require("../artifacts/contracts/Wearable.sol/Wearable.json");
const signTransaction = require("../functions/SignTransaction");
const NFTContract = new web3.eth.Contract(contract.abi, NFTContractAddress);

async function mintNFT(receiverAddress, tokenURI) {
  try {
    console.log('minting a new nft...')
    const nonce = await web3.eth.getTransactionCount(OWNER_PUBLIC_KEY, "latest"); //get latest nonce

    const data = NFTContract.methods
      .mintNFT(receiverAddress, tokenURI)
      .encodeABI();

    const gas = await web3.eth.estimateGas({
      from: OWNER_PUBLIC_KEY,
      to: NFTContractAddress,
      data,
    });

    const tx = {
      from: OWNER_PUBLIC_KEY,
      to: NFTContractAddress,
      nonce: nonce,
      gas,
      data,
    };
    console.log({tx})
    const signedTransaction = await signTransaction({tx, web3})

    const {
      logs: [{ topics }],
    } = signedTransaction;
    const [, , , tokenId] = Array.from(topics);
    console.log({ tokenId });
  } catch (error) {
    console.log(error);
  }
}

mintNFT(
  OWNER_PUBLIC_KEY,
  "https://gateway.pinata.cloud/ipfs/QmcrRFdYY5R9EdNJmoRFmWaZjnjaDmuZXvHfXmAPoHpH6V"
);
