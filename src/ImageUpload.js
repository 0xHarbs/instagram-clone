import React, {Component} from "react"
import './ImageUpload.css'
import Button from '@mui/material/Button';
import ImageIcon from '@mui/icons-material/PhotoLibraryRounded';

class ImageUpload extends Component {
	constructor(props) {
		super(props)

		this.state = {
			image: "",
			description: ""
		}
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		this.setState({file: URL.createObjectURL(event.target.files)})
	}

	render() {
	return(
		<div className="imageUpload">
			<div className="input__container">
				<h3 className="input__title">Create post</h3>
				<hr></hr>
				<textarea
				placeholder="What's on your mind?..." 
				className="imageUpload__textInput"
				value={this.state.description}
				onChange={ (e) => this.setState({description: e.target.value}) }
				required
				>
				</textarea>
				<img id="image__output" src={this.props.imageFile}/>
				<label className="image__input" for="file-input">
					<ImageIcon className="icon"/>
					<p>Photo/Video</p>
				</label>
				<input id="file-input" type="file" 
				accept=".jpg, jpeg, .png, .bmp, .gif"
				onChange={this.props.captureFile}
				required
				/>
				<Button onClick={(e) => {
					this.props.uploadImage(this.state.description)
				}}>
				Post
				</Button>
			</div>
		</div>
		)
	}
}
export default ImageUpload;