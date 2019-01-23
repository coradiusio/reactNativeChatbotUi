/* global alert */
/* global Image */
/* global Blob */
/* global FileReader */

import React from 'react'

import {
  StyleSheet,
  View
} from 'react-native'

import Camera from './Camera'
import CameraControl from './CameraControl'
import ImagePreview from './ImagePreview'

import {
  resizeImage
} from '../../utils'

export default class DocumentHandler extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isPictureCapturingStart: false,
      isPictureCaptured: false,
      pictureData: {},
      flashMode: 'off'
    }

    this.handleIsPictureCapturing = this.handleIsPictureCapturing.bind(this)
    this.resetPicture = this.resetPicture.bind(this)
    this.toggleFlash = this.toggleFlash.bind(this)
    this.submitPicture = this.submitPicture.bind(this)
    this.handlePictureTaken = this.handlePictureTaken.bind(this)
    this.handleDocuments = this.handleDocuments.bind(this)
    this.handleDocumentUpload = this.handleDocumentUpload.bind(this)
  }

  handleDocumentUpload (e) {
    const me = this

    const fileinput = document.getElementById(e.target.id)
    const fileToLoad = fileinput.files[0]
    const fileNameSplit = fileToLoad.name.split('.')
    const fileName = fileNameSplit[0]
    const fileExtension = fileNameSplit[fileNameSplit.length - 1]
    const maxWidth = fileinput.getAttribute('data-maxwidth')
    const maxHeight = fileinput.getAttribute('data-maxheight')

    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      alert('The File APIs are not fully supported in this browser.')
      return false
    }

    if (!(/image/i).test(fileToLoad.type)) {
      alert('File ' + fileToLoad.name + ' is not an image.')
      return false
    }

    // read the files
    const reader = new FileReader()
    reader.readAsArrayBuffer(fileToLoad)

    reader.onload = function (event) {
      // blob stuff
      const blob = new Blob([event.target.result]) // create blob...
      window.URL = window.URL || window.webkitURL
      const blobURL = window.URL.createObjectURL(blob) // and get it's URL

      // helper Image object
      const image = new Image()
      image.src = blobURL
      image.onload = function () {
        // have to wait till it's loaded
        const resized = resizeImage(image, fileExtension, maxWidth, maxHeight, 0.6) // send it to canvas
        console.log('image base64 length :- ', resized.length)

        me.handlePictureTaken(window.URL.createObjectURL(fileToLoad))
      }
    }

    fileinput.value = ''
  }

  toggleFlash () {
    this.setState(prevState => ({
      flashMode: prevState.flashMode === 'torch' ? 'off' : 'torch'
    }))
  }

  handleDocuments () {
    const element = document.getElementById('file')
    if (element) {
      element.click()
    }
  }

  handlePictureTaken (data) {
    console.log('picture data :- ', data)
    this.setState({ isPictureCaptured: true, pictureData: { uri: data }, isPictureCapturingStart: false })
  }

  resetPicture () {
    this.setState({ isPictureCaptured: false, pictureData: {}, isPictureCapturingStart: false })
  }

  submitPicture () {
    this.props.onCapture(this.state.pictureData.uri, '', 'camera')
    this.props.handleStateValue('openCameraView', false)
  }

  handleIsPictureCapturing (value) {
    this.setState({ isPictureCapturingStart: value })
  }

  render () {
    console.log('this.state.isPictureCaptured :- ', this.state.isPictureCaptured)
    return (
      <View style={styles.cameraContainer}>
        {
          !this.state.isPictureCaptured
            ? <View style={styles.cameraContainer}>
              <Camera
                isPictureCapturingStart={this.state.isPictureCapturingStart}
                handleIsPictureCapturing={this.handleIsPictureCapturing}
                handleStateValue={this.props.handleStateValue}
                flashMode={this.state.flashMode}
                handlePictureTaken={this.handlePictureTaken}
              />
              <CameraControl
                handleIsPictureCapturing={this.handleIsPictureCapturing}
                flashMode={this.state.flashMode}
                toggleFlash={this.toggleFlash}
                handleDocuments={this.handleDocuments}
              />
              <input type='file' id='file' style={inputStyle} onChange={this.handleDocumentUpload} />
            </View>
            : <ImagePreview
              submitPicture={this.submitPicture}
              pictureData={this.state.pictureData}
              resetPicture={this.resetPicture}
            />
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    position: 'relative'
  }
})

const inputStyle = {
  display: 'none'
}
