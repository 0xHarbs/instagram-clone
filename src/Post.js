import React, {Component} from "react"
import './Post.css'
import Avatar from '@mui/material/Avatar';
import Web3 from 'web3';
import FavoriteIcon from '@mui/icons-material/FavoriteBorderOutlined';
import SendIcon from '@mui/icons-material/MailOutlineOutlined';

class Post extends Component {
	constructor(props) {
		super(props)

		this.state = {
			comment: "",
		}
	}


	render() {
			return(
				<div className="post" key={this.props.key}>
					<div className="post__header">
						<Avatar className="post__avatar"
						alt={this.props.username}
						src="https://images.unsplash.com/photo-1559157694-82c9bac92f26?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
						/>
						<h3>{this.props.username.length > 10 ? this.props.username.substring(0,10) + "..." : this.props.username}</h3>
					</div>
					<img className="post__image"
					src={`https://ipfs.infura.io/ipfs/${this.props.hash}`}
					alt=""
					/>
					<div className="post__infoWrapper">
						<FavoriteIcon className="icon"/> 
						<p className="post__infoText">{this.props.tipTotal > 0 ? this.props.tipTotal : 0 }</p>
						<SendIcon className="icon"/> 
						<p className="post__infoText">{this.props.tipAmount > 0 ? this.props.tipAmount.toString().slice(0,3) : 0}ETH</p>
					</div>
					<h5 className="post__text"><strong>{this.props.username.length > 10 ? this.props.username.substring(0, 6): this.props.username}</strong>: {this.props.caption}</h5>
					<form className="post__commentBox">
						<input 
						className="post__input"
						type="number"
						placeholder="Add a tip in Wei..."
						value={this.state.comment}
						onChange={ (e) => this.setState({comment: e.target.value}) }
						/>
						<button
						className="post__button"
						disabled={!this.state.comment}
						type="submit"
						onClick={async (e) => {
							e.preventDefault()
							let tip = this.state.comment
							let id = this.props.imageId.toNumber()
							this.props.tipOwner(id, tip)
						}}
						>
						Tip
						</button>
					</form>
				</div>
				)
}
}

export default Post;