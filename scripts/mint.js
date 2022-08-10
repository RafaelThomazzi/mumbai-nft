require("dotenv").config();
const ALCHEMY_URL = process.env.ALCHEMY_URL;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(ALCHEMY_URL);

const contract = require("../artifacts/contracts/Wearable.sol/Wearable.json");
const contractAddress = "0x69e5E4F31CAdA6030000777Ca4bfa981491Ad625";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);

async function mintNFT(receiverAddress, tokenURI) {
  try {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce
    const balance = await web3.eth.getBalance(PUBLIC_KEY);

    const data = nftContract.methods
      .mintNFT(receiverAddress, tokenURI)
      .encodeABI();

    const gas = await web3.eth.estimateGas({
      from: PUBLIC_KEY,
      to: contractAddress,
      data,
    });

    const tx = {
      from: PUBLIC_KEY,
      to: contractAddress,
      nonce: nonce,
      gas,
      data,
    };

    console.log({
      balance,
      nonce,
      PUBLIC_KEY,
      PRIVATE_KEY,
      ALCHEMY_URL,
      contractAddress,
      gas,
    });

    const signTransaction = await web3.eth.accounts.signTransaction(
      tx,
      PRIVATE_KEY
    );

    const sendSignedTransaction = await web3.eth.sendSignedTransaction(
      signTransaction.rawTransaction,
      async (error, hash) => {
        if (error) {
          console.log(
            "Something went wrong when submitting your transaction:",
            error
          );
        }

        const interval = setInterval(function () {
          web3.eth.getTransactionReceipt(hash, function (err, receipt) {
            if (receipt) {
              clearInterval(interval);
              return receipt;
            }
          });
        }, 1000);
      }
    );

    console.log(sendSignedTransaction);

    const {
      logs: [{ topics }],
    } = sendSignedTransaction;
    const [, , , tokenId] = Array.from(topics);
    console.log({ tokenId });
  } catch (error) {
    console.log(error);
  }
}

mintNFT(
  PUBLIC_KEY,
  "https://gateway.pinata.cloud/ipfs/QmPsbGNds3T48Q4cHJ4itAiFSjfsa4ghmBzFnb2VwsvePN"
);
