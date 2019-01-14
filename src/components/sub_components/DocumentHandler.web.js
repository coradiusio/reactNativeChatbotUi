import React from 'react'

import {
  StyleSheet,
  View
} from 'react-native'

import Camera from './Camera'
import CameraControl from './CameraControl'
import ImagePreview from './ImagePreview'

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
  }

  toggleFlash () {
    this.setState(prevState => ({
      flashMode: prevState.flashMode === 'torch' ? 'off' : 'torch'
    }))
  }

  handleDocuments () {
    // DocumentPicker.show({
    //   filetype: [DocumentPickerUtil.allFiles()]
    // }, (error, res) => {
    //   if (error) {
    //     console.log('error :- ', error)
    //   } else {
    //     this.handlePictureTaken(res)
    //   }
    // })
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
