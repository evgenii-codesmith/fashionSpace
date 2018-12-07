
import React from 'react';
import Login from './../router/Login.jsx'
import { Router, Route, Switch } from 'react-router-dom'
import Home from './../router/Home.jsx'
import history from './../router/history.jsx'
import PhotoUpload from './../router/PhotoUpload.jsx'
import axios from 'axios'

// require('dotenv').config();

// const CLOUDINARY_UPLOAD_URL = process.env.CLOUDINARY_UPLOAD_URL;
// const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET
// const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalImgInfo: {},
      username: "",
      userUuid: "",
      password: "",
      isAuthenticated: false,
      uploadedFileCloudinaryUrl: "",
      uploadedSuccess: false,
      uploadText: "",
      uploadStyleClickNightOut: false,
      uploadStyleClickOutDoor: false,
      topPictureList: {},
      displayPicArr: []
    };

    this.handleUsername = this.handleUsername.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handlePicSubmit = this.handlePicSubmit.bind(this);
    this.handleLoader = this.handleLoader.bind(this);
    this.handleUploadText = this.handleUploadText.bind(this);
    this.onImageDrop = this.onImageDrop.bind(this);
    this.uploadImageReturnHome = this.uploadImageReturnHome.bind(this);
    this.uploadOnclickStyleNightOut = this.uploadOnclickStyleNightOut.bind(
      this
    );
    this.uploadOnclickStyleOutDoor = this.uploadOnclickStyleOutDoor.bind(this);
    this.handleUrlAndTextSubmit = this.handleUrlAndTextSubmit.bind(this);
    this.getTopPictureUrls = this.getTopPictureUrls.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.ExitModal = this.ExitModal.bind(this);
  }
  
  ExitModal() {
    this.setState({
      showModal: false
    });
  }
  handleShowModal(event) {
    let key = event.target.id;
    console.log(this.state.topPictureList[key]);
    this.setState({
      showModal: true,
      modalImgInfo: this.state.topPictureList[key]
    });
  }

  onImageDrop(images) {
    // uploads is an array that would hold all the post methods for each image to be uploaded, then we'd use axios.all()
    const uploads = images.map(image => {

      // our formdata
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET); // Replace the preset name with your own
      formData.append("api_key", CLOUDINARY_API_KEY); // Replace API key with your own Cloudinary API key
      formData.append("timestamp", (Date.now() / 1000) | 0);


      return axios.post(
        "https://api.cloudinary.com/v1_1/ dwbr9kbj2/image/upload",
        formData, 
        { headers: { "X-Requested-With": "XMLHttpRequest" }})
        .then(response => {
          this.setState({
            uploadedFileCloudinaryUrl: response.data.url,
            uploadedSuccess: true
          });
          console.log(response.data.url);
        })
        .catch(err => console.log('drop err ', err));
    });

    // We would use axios `.all()` method to perform concurrent image upload to cloudinary.
    axios.all(uploads).then(() => {
      // ... do anything after successful upload. You can setState() or save the data
      console.log("Images have all being uploaded");
    });
  }

  handleLoginSubmit(event) {
    event.preventDefault();
    // event.target.reset();
    let position;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        position = pos.coords;
        console.log('position: ', position);
        axiosCall();
      });
    } else { 
      x.innerHTML = "Geolocation is not supported by this browser.";

    }
    const axiosCall = () => {
    axios
      .post("http://localhost:3000/login", {
        username: this.state.username,
        password: this.state.password
      })
      .then(response => {
        this.setState({
          userUuid: response.data,
          isAuthenticated: true
        });
        window.setTimeout(() => {
          history.push("/home");
        }, 3400);
      })
      .catch(err => {
        console.log(err);
      });
    }
  }

  handlePicSubmit(event) {
    event.presentDefault();
    axios.post("http://localhost:3000/upload-picture", {
      uploadedFileCloudinaryUrl: this.state.uploadedFileCloudinaryUrl,
      uploadText: this.state.uploadText
    });
  }
  deletePicture() {
    axios.delete("http://localhost:3000/delete-picture", {
      deleteFileCloudinaryUrl: this.state.uploadedFileCloudinaryUrl,
    }).then(() => {
      this.setState({
        showModal: false
      });
    })
  }

  handleUsername(event) {
    this.setState({
      username: event.target.value
    });
  }

  handlePassword(event) {
    this.setState({
      password: event.target.value
    });
  }

  handleUploadText(event) {
    this.setState({
      uploadText: event.target.value
    });
  }
  handleLoader() {
    history.push("/home/upload");
  }

  uploadImageReturnHome() {
    this.setState({
      uploadedFileCloudinaryUrl: "",
      uploadedSuccess: false
    });
    history.push("/home/");
  }

  uploadOnclickStyleNightOut() {
    this.setState({
      uploadStyleClickNightOut: !this.state.uploadStyleClickNightOut
    });
  }

  uploadOnclickStyleOutDoor() {
    this.setState({
      uploadStyleClickOutDoor: !this.state.uploadStyleClickOutDoor
    });
  }

  handleUrlAndTextSubmit() {
    event.preventDefault();
    axios
      .post("http://localhost:3000/uploadPicture", {
        userUuid: this.state.userUuid,
        uploadedFileCloudinaryUrl: this.state.uploadedFileCloudinaryUrl,
        uploadText: this.state.uploadText,
        uploadStyleClickNightOut: this.state.uploadStyleClickNightOut,
        uploadStyleClickOutDoor: this.state.uploadStyleClickOutDoor
      })
      .then(response => {
        console.log(response);
      })
      .catch(err => {
        console.log(err);
      });
  }

  getTopPictureUrls() {
    axios
      .get("http://localhost:3000/pictures")
      .then(response => {
        let arr = [];
        for (let key in response.data) {
          let img_url_crop = response.data[key].picture_url.replace(
            "upload/",
            "upload/w_500,h_500/"
          );
          console.log(img_url_crop);
          arr.push(
            <div>
              <img
                id={key}
                onClick={this.handleShowModal}
                src={img_url_crop}
                className="imgDisplay"
              />
            </div>
          );
        }
        this.setState({
<<<<<<< HEAD
            uploadStyleClickOutDoor : !this.state.uploadStyleClickOutDoor,
        })
    }

    handleUrlAndTextSubmit(){
        event.preventDefault();
        axios.post("http://localhost:3000/uploadPicture", {
            uploadedFileCloudinaryUrl: this.state.uploadedFileCloudinaryUrl,
            uploadText: this.state.uploadText,
        })
            .then(response => {
                console.log(response);
            })
            .catch( err => {
                console.log(err)
            })

    }

    getTopPictureUrls(){
        axios.get("http://localhost:3000/pictures")
            .then(response => {
                let arr = [];
                for (let key in response.data) {
                let img_url_crop = response.data[key].url.replace('upload/', 'upload/w_500,h_500/');
                console.log(img_url_crop);
                arr.push(<div><img id={key} onClick={this.handleShowModal} src={img_url_crop} className="imgDisplay"/></div>)
                }
                this.setState({
                    topPictureList: response.data,
                    displayPicArr: arr,
                })

                
            })
            .catch( err => {
                console.log(err)
            })
    }


    

    render() {
=======
>>>>>>> cb045400737e6f9b9a9201d73d20d83161ef21bb

          topPictureList: response.data,
          displayPicArr: arr
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    let sound = null;
    if (this.state.isAuthenticated) {
      sound = Coldplay;
    }
    return (
      // ROUTES
      <div>
      <Router history={history}>
        {/* <Switch> */}
        <div>
          <Route
            exact path="/"
            render={props => (
              <Login
                {...props}
                parentState={this.state}
                handleUsername={this.handleUsername}
                handlePassword={this.handlePassword}
                handleLoginSubmit={this.handleLoginSubmit}
              />
            )}
          />
          <Route
            path="/home"
            render={props => (
              <Home
                {...props}
                parentState={this.state}
                handleLoader={this.handleLoader}
                onImageDrop={this.onImageDrop}
                uploadImageReturnHome={this.uploadImageReturnHome}
                handleUploadText={this.handleUploadText}
                uploadOnclickStyleOutDoor={this.uploadOnclickStyleOutDoor}
                uploadOnclickStyleNightOut={this.uploadOnclickStyleNightOut}
                handleUrlAndTextSubmit={this.handleUrlAndTextSubmit}
                getTopPictureUrls={this.getTopPictureUrls}
                ExitModal={this.ExitModal}
              />
            )}
          />
          <Route
            path="/"
            component={sound}
          />
        </div>
        {/* </Switch>   */}
      </Router>
      </div>
    );
  }
}

export default App;
