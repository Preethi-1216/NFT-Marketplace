import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import NFTMarketplace from "./NFTMarketplace.json"; // ABI file

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractAddress = "YOUR_CONTRACT_ADDRESS";
      const nftMarketplace = new ethers.Contract(contractAddress, NFTMarketplace.abi, signer);
      setContract(nftMarketplace);
    };
    init();
  }, []);

  const connectWallet = async () => {
    const [account] = await window.ethereum.request({ method: "eth_requestAccounts" });
    setCurrentAccount(account);
  };

  const mintNFT = async (uri, price) => {
    if (!contract) return;
    await contract.mint(uri, price);
  };

  return (
    <div>
      <h1>NFT Marketplace</h1>
      {!currentAccount ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <div>
          <p>Wallet connected: {currentAccount}</p>
          <MintNFT mintNFT={mintNFT} />
        </div>
      )}
    </div>
  );
};

const MintNFT = ({ mintNFT }) => {
  const [uri, setUri] = useState("");
  const [price, setPrice] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="Enter Token URI"
        value={uri}
        onChange={(e) => setUri(e.target.value)}
      />
      <input
        type="number"
        placeholder="Enter Price (in ETH)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={() => mintNFT(uri, ethers.utils.parseEther(price))}>Mint NFT</button>
    </div>
  );
};

export default App;
