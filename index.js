const Web3 = require("web3");
const contractAbi = require("./ArbContractABI.json");

const providerUrl = "https://rpc.ankr.com/arbitrum"; // or your preferred Ethereum provider URL
const contractAddress = "0x67a24ce4321ab3af51c2d0a4801c3e111d88c9d9"; // replace with the contract address you want to interact with
const privateKeys = ["your private key", "your private key"]; // array of private keys

async function main() {
  const web3 = new Web3(providerUrl);

  const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
  const claimFunction = contractInstance.methods.claim();

  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 4000000; // replace with your preferred gas limit

  const encodedFunction = claimFunction.encodeABI();

  for (const privateKey of privateKeys) {
    try {
      const address = await web3.eth.accounts.privateKeyToAccount(privateKey)
        .address;
      const nonce = await web3.eth.getTransactionCount(address);
      const signedTx = await web3.eth.accounts.signTransaction(
        {
          to: contractAddress,
          data: encodedFunction,
          gas: gasLimit,
          gasPrice: gasPrice,
          nonce: nonce,
        },
        privateKey
      );

      const txReceipt = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      console.log(`Transaction hash: ${txReceipt.transactionHash}`);
    } catch (error) {
      console.error(`Error sending transaction: ${error}`);
    }
  }
}

main();
