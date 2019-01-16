import React from 'react'

import {
  StyleSheet,
  View
} from 'react-native'

import { BrowserQRCodeReader } from '@zxing/library'
import { isUndefined, isEmpty } from 'lodash'

import {
  colors
} from '../../utils'

import Camera from './Camera'

import QRCodeRenderMarker from './QRCodeRenderMarker'

const codeReader = new BrowserQRCodeReader()

export default class QRCodeScanner extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      scanning: false,
      flashMode: 'off',
      deviceId: ''
    }

    this._handleBarCodeRead = this._handleBarCodeRead.bind(this)
    this.toggleFlash = this.toggleFlash.bind(this)
    this.handleDeviceId = this.handleDeviceId.bind(this)
  }

  handleDeviceId (value) {
    if (value) {
      this.setState({ deviceId: value }, () => this._handleBarCodeRead())
    }
  }

  _setScanning (value) {
    this.setState({ scanning: value })
  }

  _handleBarCodeRead () {
    const videoElement = document.getElementById('camera-stream')
    if (videoElement) {
      const {
        deviceId
      } = this.state
      if (!isUndefined(deviceId) && !isEmpty(deviceId)) {
        codeReader.decodeFromInputVideoDevice(undefined, 'camera-stream')
          .then(result => {
            this.props.onRead(result.text)
          })
          .catch(err => {
            console.log('could not scan :- ', err)
          })
      }
    }
  }

  componentWillUnmount () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  toggleFlash () {
    this.setState(prevState => ({
      flashMode: prevState.flashMode === 'torch' ? 'off' : 'torch'
    }))
  }

  _renderCameraMarker () {
    const {
      primaryColor,
      borderWidth
    } = this.props

    return (
      <QRCodeRenderMarker
        primaryColor={primaryColor}
        borderWidth={borderWidth}
        flashMode={this.state.flashMode}
        toggleFlash={this.toggleFlash}
      />
    )
  }

  getScreenshot (videoEl, deviceId) {
    const scale = 1
    const canvas = document.createElement('canvas')
    canvas.width = videoEl.clientWidth * scale
    canvas.height = videoEl.clientHeight * scale
    canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height)

    var img = document.createElement('img')
    img.src = canvas.toDataURL()
    return img
  }

  render () {
    return (
      <View style={[styles.cameraContainer, this.props.containerStyle]}>
        <Camera
          isPictureCapturingStart={this.state.isPictureCapturingStart}
          handleIsPictureCapturing={this.handleIsPictureCapturing}
          handleStateValue={this.props.handleStateValue}
          flashMode={this.state.flashMode}
          handlePictureTaken={this.handlePictureTaken}
          handleDeviceId={this.handleDeviceId}
        />
        <View style={{ ...StyleSheet.absoluteFillObject }}>
          {this._renderCameraMarker()}
        </View>
        <div id='captured-image-container' />
      </View>
    )
  }
}

QRCodeScanner.defaultProps = {
  borderWidth: 4,
  primaryColor: colors.primary
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    position: 'relative'
  }
})
