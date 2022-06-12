/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import "./Home.css";
import Web3 from "web3";
import dreamabi from "./Dreamabi.json";
import abi from "./abi.json";
import { useEffect, useState } from "react";
import opensea from "./assets/opensea.svg";
import caps from "./assets/captains.png";

require("dotenv").config();
const { REACT_APP_CONTRACT_ADDRESS } = process.env;

const Home = ({ connecctstatus, setConnectedstatus }) => {
	const [connectedAccount, setConnectedAccount] = useState("Connect Wallet");
	const [connected, setConnected] = useState(false);
	const [contract, setContract] = useState(null);
	// const [tokenId, setTokenId] = useState(null);
	const [supply, setTokenSupply] = useState(null);
	const [price, setPrice] = useState();
	const [preprice, setPrePrice] = useState();
	const [priceInEth, setPriceInEth] = useState(0.08);
	const [quantity, setQuantity] = useState(1);
	const [minted, setMinted] = useState(false);
	const [isHolder, setHolder] = useState(false);
	// console.log("C", connecctstatus);

	useEffect(() => {
		loadWeb3();
	}, []);

	async function loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			// await window.ethereum.enable();
			const web3 = window.web3;
			// creating contract instance
			const contractaddress = REACT_APP_CONTRACT_ADDRESS;
			const ct = new web3.eth.Contract(dreamabi, contractaddress);
			setContract(ct);
			console.log("ct", ct);
			let price = await ct.methods.price().call();
			let presaleprice = await ct.methods.Holderprice().call();
			setContract(ct);
			setPrice(price);
			setPrePrice(presaleprice);
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
	async function Getdata() {
		window.web3 = new Web3(window.ethereum);
		const web3 = window.web3;
		const wofaddress = "0xa98264c5e38636a83ed047942105bc03afbd6b97";
		const ct = new web3.eth.Contract(abi, wofaddress);
		const metaMaskAccount = await web3.eth.getAccounts();
		const balance = await ct.methods.balanceOf(metaMaskAccount[0]).call();
		console.log(balance, "balance");
		if (balance > 0) {
			setHolder(true);
		}
	}
	async function mint() {
		// alert("normal");
		console.log(isHolder, "holder status");
		const web3 = window.web3;
		const _value = price * quantity;
		const address = await web3.eth.getAccounts();

		await contract.methods
			.Mint(quantity)
			.send({ from: address.toString(), value: _value });
		setMinted(true);
		const totalSupply = await contract.methods.totalSupply().call();
		setTokenSupply(totalSupply);
	}
	async function HolderMint() {
		console.log(isHolder, "holder status");
		const web3 = window.web3;
		const _value = preprice * quantity;
		const address = await web3.eth.getAccounts();

		// WHITELIST KA METHOD LG GYA

		await contract.methods
			.HolderMint(quantity)
			.send({ from: address.toString(), value: _value });
		setMinted(true);
		const totalSupply = await contract.methods.totalSupply().call();
		setTokenSupply(totalSupply);
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
			setConnected(true);
			Getdata();
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
					<img src={caps} alt="caps" className="img-fluid" />
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

							<button type="button" className="btn text-black">
								{quantity}
							</button>
							<button
								type="button"
								className="btn bg-white text-black"
								onClick={() => {
									if (quantity < 50) {
										setQuantity(quantity + 1);
									}
								}}
							>
								+
							</button>
						</div>
					</div>
					<br />
					{connected ? (
						isHolder ? (
							<>
								<a
									className="px-5 text-center btn-visit rounded-pill"
									onClick={async () => {
										HolderMint();
									}}
								>
									Holder Mint
								</a>
							</>
						) : (
							<a
								className="px-5 text-center btn-visit rounded-pill"
								onClick={async () => {
									mint();
								}}
							>
								Mint Now
							</a>
						)
					) : (
						<a
							className="px-5 text-center btn-visit rounded-pill"
							onClick={async () => {
								connectWallet();
							}}
						>
							Connect wallet
						</a>
					)}
					{/* <p className="fw-bold fs-3">{supply} / 5500</p> */}
					{minted ? (
						<>
							<p className="fs-3 text-black">
								Congrats! Token Minted. Please Check your Wallet
							</p>
							<br />
							<a
								href="https://opensea.io/collection/wof-dream-team"
								className="fs-3 fw-bold nounderline text-black"
							>
								View On &nbsp;
								<img src={opensea} alt="" height="40px" />
							</a>
						</>
					) : null}
				</div>
			</div>
			<div className="container text-center text-black">
				<h1 className="display-3">Mint Your WOF Dream Team NFT</h1>
			</div>
		</>
	);
};

export default Home;
