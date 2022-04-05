import React from "react";
import "./Home.css";
import Web3 from "web3";
import abi from "./abi.json";
import { useEffect, useState } from "react";
import axios from "axios";
// import opensea from "./assets/opensea.svg";
import caps from "./assets/captains.png";

import whiteListAddresses from "./whitelist";

require("dotenv").config();
const { REACT_APP_CONTRACT_ADDRESS } = process.env;

const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

const Home = ({ connecctstatus, setConnectedstatus }) => {
  const [connectedAccount, setConnectedAccount] = useState("Connect Wallet");
  const [contract, setContract] = useState(null);
  // const [tokenId, setTokenId] = useState(null);
  const [supply, setTokenSupply] = useState(null);
  const [price, setPrice] = useState();
  const [priceInEth, setPriceInEth] = useState(0.08);
  const [quantity, setQuantity] = useState(1);
  const [minted, setMinted] = useState(false);
  // console.log("C", connecctstatus);

  useEffect(() => {
    loadWeb3();
  }, []);

  async function loadWeb3() {
    connectWallet();
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      // await window.ethereum.enable();
      const web3 = window.web3;
      // creating contract instance
      const contractaddress = REACT_APP_CONTRACT_ADDRESS;
      const ct = new web3.eth.Contract(abi, contractaddress);
      setContract(ct);
      console.log("ct", ct);
      let price = await ct.methods.price().call();
      setContract(ct);
      setPrice(price);
      setPriceInEth(web3.utils.fromWei(price, "ether"));
      const totalSupply = await ct.methods.totalSupply().call();
      setTokenSupply(totalSupply);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }
  async function whitelistMint() {
    const web3 = window.web3;
    const _value = price * quantity;
    const address = await web3.eth.getAccounts();

    const senderAddress = address[0];
    const sentAddress = keccak256(senderAddress);
    const leafNodes = whiteListAddresses.map((addr) => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, {
      sortPairs: true,
    });
    const rootHash = merkleTree.getHexRoot();
    const merkleProof = merkleTree.getHexProof(sentAddress);
    console.log(rootHash, merkleProof);

    // WHITELIST KA METHOD LGANA IDHR

    // await contract.methods
    //   .whiteListMint(merkleProof, quantity)
    //   .send({ from: address.toString(), value: _value });
    // setMinted(true);
    // const totalSupply = await contract.methods.totalSupply().call();
    // setTokenSupply(totalSupply);
  }

  async function connectWallet() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;
      const metaMaskAccount = await web3.eth.getAccounts();
      setConnectedstatus(true);
      let splitedMetaMaskAddress;
      if (metaMaskAccount) {
        splitedMetaMaskAddress =
          metaMaskAccount[0].substring(0, 6) +
          "......" +
          metaMaskAccount[0].substring(
            metaMaskAccount[0].length - 4,
            metaMaskAccount[0].length
          );
      }
      setConnectedAccount(splitedMetaMaskAddress);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }
  return (
    <>
      <div className="container">
        <h1 className="text-center">
          <img src={caps} alt="caps" height="600px" className="img-fix" />
        </h1>
      </div>
      <div className="container text-center d-flex justify-content-center py-5">
        <div className="text-center text-white">
          <div className="btngroup">
            <div className="" role="group" aria-label="First group">
              <button
                type="button"
                className="btn bg-white text-black"
                onClick={() => {
                  if (quantity > 1) {
                    setQuantity(quantity - 1);
                  }
                }}
              >
                -
              </button>

              <button type="button" className="btn text-white">
                {quantity}
              </button>
              <button
                type="button"
                className="btn bg-white text-black"
                onClick={() => {
                  if (quantity < 2) {
                    setQuantity(quantity + 1);
                  }
                }}
              >
                +
              </button>
            </div>
          </div>
          <br />
          <a
            className="px-5 text-center btn-visit rounded-pill"
            onClick={async () => {
              await connectWallet();
              whitelistMint();
            }}
          >
            Mint Now
          </a>
          <p className="fw-bold fs-3">{supply} / 21</p>
        </div>
      </div>
      <div className="container text-center">
        <h1 className="display-3">Mint your GOLD CAPTAIN</h1>
      </div>
    </>
  );
};

export default Home;
