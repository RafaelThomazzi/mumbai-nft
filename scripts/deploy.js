async function main() {
  const Wearable = await ethers.getContractFactory("Wearable");

  // Start deployment, returning a promise that resolves to a contract object
  const wearable = await Wearable.deploy();
  await wearable.deployed();
  console.log("Contract deployed to address:", wearable.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
