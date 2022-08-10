require("dotenv").config();
const OWNER_PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY;

async function signTransaction({ tx, web3, signer = OWNER_PRIVATE_KEY}) {
  try {
    console.log("signing transaction...");
    const signTransaction = await web3.eth.accounts.signTransaction(
      tx,
      signer
    );

    if (!signTransaction?.rawTransaction) {
      console.log(
        "Something went wrong when submitting your transaction:",
        signTransaction
      );
    }

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
    return sendSignedTransaction;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

module.exports = signTransaction;
