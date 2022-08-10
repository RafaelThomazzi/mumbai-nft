require("dotenv").config();
const ALCHEMY_URL = process.env.ALCHEMY_URL;
const OWNER_PUBLIC_KEY = process.env.OWNER_PUBLIC_KEY;
const NFTContractAddress = process.env.NFT_CONTRACT_ADDRESS;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ALCHEMY_URL);

const contract = require("../artifacts/contracts/Wearable.sol/Wearable.json");
const signTransaction = require("../functions/SignTransaction");
const NFTContract = new web3.eth.Contract(contract.abi, NFTContractAddress);

async function burnNFT(tokenId) {
  try {
    console.log('burning a nft...')
    const nonce = await web3.eth.getTransactionCount(OWNER_PUBLIC_KEY, "latest");
    const data = await NFTContract.methods.destroyNFT(tokenId).encodeABI();

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

    await signTransaction({tx, web3})
  } catch (error) {
    console.log(error);
  }
}

burnNFT("0x0000000000000000000000000000000000000000000000000000000000000007");
