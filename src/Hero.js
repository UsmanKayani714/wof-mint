/* eslint-disable jsx-a11y/anchor-is-valid */
import Web3 from "web3";
import logo from "./assets/logo.png";
import { useState, useEffect } from "react";
import "./Hero.css";
require("dotenv").config();
function Hero({ setconnecctstatus, connecctstatus }) {
	const [connectedAccount, setConnectedAccount] = useState("Connect Wallet");
	useEffect(() => {
		if (connecctstatus) {
			connectWallet();
		}
	});
	async function connectWallet() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable();
			const web3 = window.web3;
			const metaMaskAccount = await web3.eth.getAccounts();

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
			console.log("CCC", connecctstatus);
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
			<div className="headline py-3">
				<div className="container text-center">
					<strong>MINTING NOW:</strong> 1 "CAMISOLA" NFT = 1 IRL Forjães JERSEY
					+ SHIPPING + VOTING RIGHTS ON WEEKLY MVP
				</div>
			</div>
			{/* <nav className="navbar navbar-expand-lg navbar-light">
				<div className="container">
					<a className="navbar-brand" href="#">
						<img src={logo} alt="" height="120px" />
					</a>

					<button
						className="navbar-toggler"
						type="button"
						data-bs-toggle="collapse"
						data-bs-target="#navbarNavAltMarkup"
						aria-controls="navbarNavAltMarkup"
						aria-expanded="false"
						aria-label="Toggle navigation"
					>
						<span className="navbar-toggler-icon"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
						<div className="navbar-nav ms-auto align-items-center">
							<a
								className="nav-link px-5 text-center text-black"
								href="https://worldoffootball.io"
								tabIndex="-1"
								aria-disabled="true"
							>
								Back to Home
							</a>
							<a
								className="nav-link px-5 btn-visit text-center"
								href="#"
								tabIndex="-1"
								aria-disabled="true"
								onClick={connectWallet}
							>
								{connectedAccount}
							</a>
						</div>
					</div>
				</div>
			</nav> */}
		</>
	);
}

export default Hero;
