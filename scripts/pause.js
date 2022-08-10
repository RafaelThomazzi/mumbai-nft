require("dotenv").config();
const ALCHEMY_URL = process.env.ALCHEMY_URL;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ALCHEMY_URL);

const contract = require("../artifacts/contracts/Wearable.sol/Wearable.json");
const contractAddress = "0x69e5E4F31CAdA6030000777Ca4bfa981491Ad625";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function pause() {
  try {
    const pause = await nftContract.methods.pause().encodeABI();
    console.log(pause);
  } catch (error) {
    console.log(error);
  }
}

pause();
