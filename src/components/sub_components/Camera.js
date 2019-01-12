import React from 'react'
import PropTypes from 'prop-types'

import {
  StyleSheet,
  View,
  Text,
  Platform,
  PermissionsAndroid
} from 'react-native'

import Permissions from 'react-native-permissions'
import { RNCamera } from 'react-native-camera'

const PERMISSION_AUTHORIZED = 'authorized'
const CAMERA_PERMISSION = 'camera'

const defaultCameraProps = {
  focusDepth: 1.0,
  captureAudio: false,
  type: 'back',
  autoFocus: true,
  permissionDialogTitle: 'Permission to use camera',
  permissionDialogMessage: 'We need your permission to use your camera phone'
}

class Camera extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isAuthorized: false,
      isAuthorizationChecked: false
    }
  }

  static propTypes = {
    vibrate: PropTypes.bool,
    reactivate: PropTypes.bool,
    reactivateTimeout: PropTypes.number,
    fadeIn: PropTypes.bool,
    cameraType: PropTypes.oneOf(['front', 'back']),
    containerStyle: PropTypes.any,
    cameraStyle: PropTypes.any,
    notAuthorizedView: PropTypes.element,
    permissionDialogTitle: PropTypes.string,
    permissionDialogMessage: PropTypes.string,
    checkAndroid6Permissions: PropTypes.bool,
    cameraProps: PropTypes.object
  }

  static defaultProps = {
    reactivate: false,
    vibrate: true,
    reactivateTimeout: 0,
    fadeIn: true,
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
          Please Wait
        </Text>
      </View>
    ),
    permissionDialogTitle: 'Info',
    permissionDialogMessage: 'Need camera permission',
    checkAndroid6Permissions: false,
    cameraProps: {}
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

  componentWillReceiveProps (nextProps) {
    if (nextProps.isPictureCapturingStart) {
      this.takePicture()
    }
  }

  takePicture = async function () {
    if (this.camera) {
      this.props.handleStateValue('showProgress', true)
      this.props.handleIsPictureCapturing(false)
      this.camera.takePictureAsync()
        .then(data => {
          this.props.handlePictureTaken(data)
          this.props.handleStateValue('showProgress', false)
        })
        .catch(err => {
          console.log('error in taking picture :- ', err)
        })
    }
  }

  render () {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref
        }}
        style={styles.camera}
        type={this.props.cameraType}
        autoFocus
        flashMode={RNCamera.Constants.FlashMode[this.props.flashMode]}
        {...Object.assign({}, defaultCameraProps, this.props)}
      />
    )
  }
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: null,
    width: null
  }
})

export default Camera
