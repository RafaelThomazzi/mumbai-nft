# mumbai-nft
ERC-721 smart contract on the Polygon test network (mumbai) using MetaMask, Solidity, Hardhat, Pinata and Alchemy.

# To install dependencies
npm install

# To Deploy Contract
npx hardhat run scripts/deploy.js --network matic

# To verify if contract has been succesfully created
npx hardhat verify --network matic ${address}

# To mint
node scripts/mint.js

