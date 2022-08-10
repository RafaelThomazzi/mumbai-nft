require("dotenv").config();
const ALCHEMY_URL = process.env.ALCHEMY_URL;
const OWNER_PUBLIC_KEY = process.env.OWNER_PUBLIC_KEY;
const NFTContractAddress = process.env.NFT_CONTRACT_ADDRESS;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ALCHEMY_URL);

const contract = require("../artifacts/contracts/Wearable.sol/Wearable.json");
const signTransaction = require("../functions/SignTransaction");
const NFTContract = new web3.eth.Contract(contract.abi, NFTContractAddress);

async function transfer({ from, to, tokenId }) {
  try {
    console.log('transferring nft...')
    const data = NFTContract.methods.transferFrom(from, to, tokenId).encodeABI();
    const gas = await web3.eth.estimateGas({
      from: OWNER_PUBLIC_KEY,
      to: NFTContractAddress,
      data,
    });

    const tx = {
      from: OWNER_PUBLIC_KEY,
      to: NFTContractAddress,
      gas,
      data,
    };

    await signTransaction({tx, web3})
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

transfer({
  from: "0x7b123E24Ca552648Fa66ea7428362ecF2b0eDB3F",
  to: "0xed8eca1917f586b67d2fb88930002e60828958a6",
  tokenId: "0x0000000000000000000000000000000000000000000000000000000000000008",
});
