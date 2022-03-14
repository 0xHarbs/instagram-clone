import React, {Component} from "react"
import Hero from "../components/Hero"
import Staking from "../components/Staking"
import Footer from '../components/Footer'
import EmailInput from '../components/EmailInput'
import { homeObjOne } from "../components/HomeObjOne"
import { homeObjTwo } from "../components/HomeObjTwo"
import Web3 from 'web3'
import DaiToken from '../abis/DaiToken.json'
import DappToken from '../abis/DappToken.json'
import TokenFarm from '../abis/TokenFarm.json'

class Home extends Component {
	

	async componentDidMount() {
		await this.connectWallet()
		await this.loadBlockchainData()
	}

	async connectWallet() {
		if (window.ethereum) {
			try {
				const accounts = await window.ethereum.request({ method: "eth_requestAccounts"})
				this.setState({account: accounts[0]})
				console.log("Stored as", this.state.account)
			} catch (error) {
				console.log(error)
			}
		} else{
			window.alert('Please install MetaMask')
		}
	}

	async loadBlockchainData() {
		const web3 = new Web3(window.ethereum)
		const networkId = await window.ethereum.request({method: 'net_version'})
		
		const daiTokenData = DaiToken.networks[networkId]
		if(daiTokenData) {
			const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
			this.setState({daiToken})
			let daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
			this.setState({daiTokenBalance: daiTokenBalance.toString()})
		} else {
			window.alert('DaiToken contract not deployed to network')
		}

		const dappTokenData = DappToken.networks[networkId]
		if(dappTokenData) {
			const dappToken = new web3.eth.Contract(DappToken.abi, dappTokenData.address)
			this.setState({dappToken})
			let dappTokenBalance = await dappToken.methods.balanceOf(this.state.account).call()
			this.setState({dappTokenBalance: dappTokenBalance.toString()})
		} else {
			window.alert('DappToken contract not deployed to network')
		}

		const tokenFarmData = TokenFarm.networks[networkId]
    	if(tokenFarmData) {
      		const tokenFarm = new web3.eth.Contract(TokenFarm.abi, tokenFarmData.address)
      		this.setState({tokenFarm})
      		let stakingBalance = await tokenFarm.methods.stakingBalance(this.state.account).call()
      		this.setState({stakingBalance: stakingBalance.toString()})
      		console.log(tokenFarm)
    	} else {
      		window.alert('DappToken contract not deployed to detected network')
    	}
    	this.setState({ loading: false })
	}

		stakeTokens = async (amount) => {
		   	this.setState({ loading: true })

		   	await this.state.daiToken.methods.approve(this.state.tokenFarm.address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
		    	this.state.tokenFarm.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
		      	this.setState({ loading: false })
		       })
		   })
		}


  		unstakeTokens = (amount) => {
    		this.setState({ loading: true })
    		this.state.tokenFarm.methods.unstakeTokens().send({ from: this.state.account }).on('transactionHash', (hash) => {
     		console.log("Unstake completed")
     		this.setState({ loading: false })
    		})
  		}


	constructor(props) {
		super(props)
		this.state = {
			account: "0x0",
			daiToken: {},
			dappToken: {},
			tokenFarm: {},
			daiTokenBalance: '0',
			dappTokenBalance: '0',
			stakingBalance: '0',
			loading: true
		}
	}

	render() {
		return(
			<div className="app_page">
				<Hero {...homeObjOne}/>
				{!this.state.loading &&  
						<Staking 
						daiTokenBalance={this.state.daiTokenBalance}
						dappTokenBalance={this.state.dappTokenBalance}
						stakingBalance={this.state.stakingBalance}
						stakeTokens={this.stakeTokens}
						unstakeTokens={this.unstakeTokens}
						/>
				}
				<Hero {...homeObjTwo}/>
				<EmailInput />
				<Footer />
			</div>
			)
}	}

export default Home;