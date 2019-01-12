import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  StyleSheet,
  Vibration,
  View,
  Dimensions
} from 'react-native'

import * as Animatable from 'react-native-animatable'

import Camera from './Camera'
import QRCodeRenderMarker from './QRCodeRenderMarker'

import {
  colors
} from '../../utils'

const windowObject = Dimensions.get('window')

export default class QRCodeScanner extends Component {
  static propTypes = {
    onRead: PropTypes.func.isRequired,
    reactivate: PropTypes.bool,
    reactivateTimeout: PropTypes.number,
    fadeIn: PropTypes.bool,
    containerStyle: PropTypes.any,
    cameraStyle: PropTypes.any
  }

  static defaultProps = {
    onRead: () => console.log('QR code scanned!'),
    reactivate: false,
    reactivateTimeout: 0,
    fadeIn: true
  }

  constructor (props) {
    super(props)
    this.state = {
      scanning: false,
      flashMode: 'off'
    }

    this._handleBarCodeRead = this._handleBarCodeRead.bind(this)
    this.toggleFlash = this.toggleFlash.bind(this)
  }

  _setScanning (value) {
    this.setState({ scanning: value })
  }

  _handleBarCodeRead (e) {
    if (!this.state.scanning) {
      Vibration.vibrate()
      this._setScanning(true)
      this.props.onRead(e)
      if (this.props.reactivate) {
        setTimeout(
          () => this._setScanning(false),
          this.props.reactivateTimeout
        )
      }
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

  _renderCamera () {
    const element = (
      <View style={styles.mainContainer}>
        <Camera
          style={[styles.camera, this.props.cameraStyle]}
          onBarCodeRead={this._handleBarCodeRead.bind(this)}
          autoFocus
          flashMode={this.state.flashMode}
          {...this.props.cameraProps}
        >
          {this._renderCameraMarker()}
        </Camera>
      </View>
    )

    if (this.props.fadeIn) {
      return (
        <Animatable.View
          animation='fadeIn'
          style={{ backgroundColor: 'transparent' }}
          useNativeDriver
        >
          {element}
        </Animatable.View>
      )
    }
    return element
  }

  reactivate () {
    this._setScanning(false)
  }

  render () {
    return (
      <View style={[styles.flex, this.props.containerStyle]}>
        {this._renderCamera()}
      </View>
    )
  }
}

QRCodeScanner.defaultProps = {
  borderWidth: 4,
  primaryColor: colors.primary
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  mainContainer: {
    width: windowObject.width,
    height: windowObject.height
  },
  camera: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: windowObject.width,
    height: windowObject.height
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
