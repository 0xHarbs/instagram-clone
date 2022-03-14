import './App.css';
import Post from "./Post";
import ImageUpload from './ImageUpload'
import React, { Component } from "react";
import Web3 from 'web3';
import Decentragram from './abis/Decentragram.json'

// const {create} = require('ipfs-http-client')
// const ipfs = create({ host: 'ipfs.infura.io', port:5001, protocol: 'https', apiPath: '/api/v0' })

const {create} = require('ipfs-http-client')
const ipfs = create({host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

class App extends Component {

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

      // We get the networkId from the browser
      const networkId = await window.ethereum.request({method: 'net_version'})

      // We use the Id as a key to find the network in the Decentragrma json file
      const networkData = Decentragram.networks[networkId]
      
      if (networkData) {
        // We get the ABI using the imported json and the address with the network Id
        const decentragram = new web3.eth.Contract(Decentragram.abi, networkData.address)
        this.setState({decentragram})
        const imagesCount = await decentragram.methods.imageCount().call()
        this.setState({ imagesCount })
        console.log(imagesCount.toNumber())

      // Load images
      for (var i=imagesCount; i > 0; i--) {
        const image = await decentragram.methods.images(i).call()
        this.setState({
          images: [...this.state.images, image]
        })
      }
      this.setState({ loading: false })
    }
  }

  captureFile = event => {

      event.preventDefault()
      const file = event.target.files[0]
      this.setState({imageFile: URL.createObjectURL(file)})
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)

      reader.onloadend = () => {
        this.setState({ buffer: Buffer(reader.result) })
        console.log('Completed capture: buffer', this.state.buffer)
      }
    }

   uploadImage = async description => {
      let result = await ipfs.add(this.state.buffer)
      this.state.decentragram.methods.uploadImage(result.path, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        console.log("Uploaded to decentragram")
        window.location.reload()
      })
    }

    tipOwner = async(id, tip) => {
      console.log("Tip is", tip)
      this.state.decentragram.methods.tipImageOwner(id).send({from: this.state.account, value: tip}).on('transactionHash', (hash) => {
        console.log("Tip completed")
      })
    }


  constructor(props) {
    super(props)
    this.state = {
      account: '',
      decentragram: null,
      images: [],
      loading: true
    }
  }

  render() {
  return (
    <div className="app">

      <div className="app__header">
        <img
        className="app__headerImage"
        src="https://1000logos.net/wp-content/uploads/2017/02/Instagram-Logo-2010-2013.png"
        alt=""
        />
      </div>

      
      <div className="app__posts">
        <div className="app_postsLeft">
        <ImageUpload 
      captureFile={this.captureFile}
      uploadImage={this.uploadImage}
      imageFile={this.state.imageFile}
      />
          {!this.state.loading && this.state.images && 
            this.state.images.map((image, key) => (
                <Post 
                username={image.author}
                caption={image.description}
                hash={image.hash}
                imageId={image.id}
                tipTotal={image.tipTotal.toString()}
                tipAmount={image.tipAmount*(10**18)}
                key={key}
                images={this.state.images}
                tipOwner={this.tipOwner}
                />
              ))}
        </div>
      </div>
      <div className="app_postsRight">
      </div>
      
    </div>
  )
}
}

export default App;