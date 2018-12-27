import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  StyleSheet,
  Vibration,
  Easing,
  View,
  Text,
  Dimensions,
  Platform,
  PermissionsAndroid,
  TouchableOpacity
} from 'react-native'

import Permissions from 'react-native-permissions'
import { RNCamera as Camera } from 'react-native-camera'
import * as Animatable from 'react-native-animatable'

import {
  Icon
} from 'reactNativeBasicComponents'

import {
  colors
} from '../../utils'

const PERMISSION_AUTHORIZED = 'authorized'
const CAMERA_PERMISSION = 'camera'
const defaultCameraProps = {
  focusDepth: 1.0,
  type: 'back'
}
const windowObject = Dimensions.get('window')

export default class QRCodeScanner extends Component {
  static propTypes = {
    onRead: PropTypes.func.isRequired,
    vibrate: PropTypes.bool,
    reactivate: PropTypes.bool,
    reactivateTimeout: PropTypes.number,
    fadeIn: PropTypes.bool,
    showMarker: PropTypes.bool,
    cameraType: PropTypes.oneOf(['front', 'back']),
    customMarker: PropTypes.element,
    containerStyle: PropTypes.any,
    cameraStyle: PropTypes.any,
    markerStyle: PropTypes.any,
    topViewStyle: PropTypes.any,
    bottomViewStyle: PropTypes.any,
    topContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    bottomContent: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    notAuthorizedView: PropTypes.element,
    permissionDialogTitle: PropTypes.string,
    permissionDialogMessage: PropTypes.string,
    checkAndroid6Permissions: PropTypes.bool,
    cameraProps: PropTypes.object
  }

  static defaultProps = {
    onRead: () => console.log('QR code scanned!'),
    reactivate: false,
    vibrate: true,
    reactivateTimeout: 0,
    fadeIn: true,
    showMarker: false,
    cameraType: 'back',
    notAuthorizedView: (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16
          }}
        >
          Camera not authorized
        </Text>
      </View>
    ),
    pendingAuthorizationView: (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 16
          }}
        >
          ...
        </Text>
      </View>
    ),
    permissionDialogTitle: 'Info',
    permissionDialogMessage: 'Need camera permission',
    checkAndroid6Permissions: false,
    cameraProps: {}
  }

  constructor (props) {
    super(props)
    this.state = {
      scanning: false,
      isAuthorized: false,
      isAuthorizationChecked: false,
      disableVibrationByUser: false,
      flashMode: 'off'
    }

    this._handleBarCodeRead = this._handleBarCodeRead.bind(this)
    this.toggleFlash = this.toggleFlash.bind(this)
  }

  componentWillMount () {
    if (Platform.OS === 'ios') {
      Permissions.request(CAMERA_PERMISSION).then(response => {
        this.setState({
          isAuthorized: response === PERMISSION_AUTHORIZED,
          isAuthorizationChecked: true
        })
      })
    } else if (
      Platform.OS === 'android' &&
      this.props.checkAndroid6Permissions
    ) {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: this.props.permissionDialogTitle,
        message: this.props.permissionDialogMessage
      }).then(granted => {
        const isAuthorized =
          Platform.Version >= 23
            ? granted === PermissionsAndroid.RESULTS.GRANTED
            : granted === true

        this.setState({ isAuthorized, isAuthorizationChecked: true })
      })
    } else {
      this.setState({ isAuthorized: true, isAuthorizationChecked: true })
    }
  }

  disable () {
    this.setState({ disableVibrationByUser: true })
  }
  enable () {
    this.setState({ disableVibrationByUser: false })
  }

  _setScanning (value) {
    this.setState({ scanning: value })
  }

  _handleBarCodeRead (e) {
    if (!this.state.scanning && !this.state.disableVibrationByUser) {
      if (this.props.vibrate) {
        Vibration.vibrate()
      }
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
      <View style={styles.mainContainer}>
        <View style={[styles.flex, styles.transparentBackground]} />
        <View style={styles.qrcodeWrapper}>
          <View style={[styles.flex, styles.transparentBackground]} />
          <View style={styles.qrcodeContainer}>
            <View
              style={[
                styles.topLeftEdge,
                {
                  borderColor: primaryColor,
                  borderLeftWidth: borderWidth,
                  borderTopWidth: borderWidth
                }
              ]}
            />
            <View
              style={[
                styles.topRightEdge,
                {
                  borderColor: primaryColor,
                  borderRightWidth: borderWidth,
                  borderTopWidth: borderWidth
                }
              ]}
            />
            <View
              style={[
                styles.bottomLeftEdge,
                {
                  borderColor: primaryColor,
                  borderLeftWidth: borderWidth,
                  borderBottomWidth: borderWidth
                }
              ]}
            />
            <View
              style={[
                styles.bottomRightEdge,
                {
                  borderColor: primaryColor,
                  borderRightWidth: borderWidth,
                  borderBottomWidth: borderWidth
                }
              ]}
            />
            <Animatable.View
              animation='slideInUp'
              direction='alternate'
              iterationCount='infinite'
              duration={2000}
              easing='linear'
              useNativeDriver
            >
              <View style={{ height: 1, marginBottom: 2, backgroundColor: primaryColor }} />
              <View style={{ height: 2, marginBottom: 2, backgroundColor: primaryColor }} />
              <View style={{ height: 3, backgroundColor: primaryColor }} />
            </Animatable.View>
          </View>
          <View style={[styles.flex, styles.transparentBackground]} />
        </View>
        <View style={[styles.flex, styles.transparentBackground, styles.bottomContainer]}>
          <TouchableOpacity
            onPress={() => this.toggleFlash()}
          >
            <Icon
              color={primaryColor}
              name={this.state.flashMode === 'torch' ? 'flash-off' : 'flash'}
              type='material-community'
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderCamera () {
    const {
      notAuthorizedView,
      pendingAuthorizationView,
      cameraType
    } = this.props

    const { isAuthorized, isAuthorizationChecked } = this.state
    if (isAuthorized) {
      const element = (
        <View style={styles.mainContainer}>
          <Camera
            style={[styles.camera, this.props.cameraStyle]}
            onBarCodeRead={this._handleBarCodeRead.bind(this)}
            type={cameraType}
            autoFocus
            flashMode={Camera.Constants.FlashMode[this.state.flashMode]}
            {...Object.assign({}, defaultCameraProps, this.props.cameraProps)}
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
    } else if (!isAuthorizationChecked) {
      return pendingAuthorizationView
    } else {
      return notAuthorizedView
    }
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
