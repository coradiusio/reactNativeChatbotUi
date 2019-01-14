import React, { Component } from 'react'

import {
  StyleSheet,
  View
} from 'react-native'

import { BrowserQRCodeReader } from '@zxing/library'

import {
  colors
} from '../../utils'

import Camera from './Camera'
import CameraControl from './CameraControl'

import QRCodeRenderMarker from './QRCodeRenderMarker'

const codeReader = new BrowserQRCodeReader()

export default class QRCodeScanner extends Component {
  constructor (props) {
    super(props)
    this.state = {
      scanning: false,
      flashMode: 'off'
    }

    this._handleBarCodeRead = this._handleBarCodeRead.bind(this)
    this.toggleFlash = this.toggleFlash.bind(this)
  }

  componentDidMount () {
    this._handleBarCodeRead()
  }

  _setScanning (value) {
    this.setState({ scanning: value })
  }

  _handleBarCodeRead (e) {
    if (document.getElementById('camera-stream')) {
      codeReader.decodeFromInputVideoDevice(undefined, 'camera-stream')
        .then(result => alert(result.text))
        .catch(err => {
          console.log('could not scan :- ', err)
        })
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

  render () {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Camera
          isPictureCapturingStart={this.state.isPictureCapturingStart}
          handleIsPictureCapturing={this.handleIsPictureCapturing}
          handleStateValue={this.props.handleStateValue}
          flashMode={this.state.flashMode}
          handlePictureTaken={this.handlePictureTaken}
        />
        <View style={{ ...StyleSheet.absoluteFillObject }}>
          {this._renderCameraMarker()}
        </View>
      </View>
    )
  }
}

QRCodeScanner.defaultProps = {
  borderWidth: 4,
  primaryColor: colors.primary
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },
  camera: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  transparentBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)'
  },
  qrcodeWrapper: {
    flexDirection: 'row'
  },
  qrcodeContainer: {
    width: 230,
    height: 230,
    backgroundColor: 'transparent'
  },
  topLeftEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 25,
    height: 25
  },
  topRightEdge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 25,
    height: 25
  },
  bottomLeftEdge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 25,
    height: 25
  },
  bottomRightEdge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 25,
    height: 25
  },
  bottomContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})
