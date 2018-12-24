import React from 'react'

import {
  View,
  StyleSheet
} from 'react-native'

import { RNCamera } from 'react-native-camera'

import {
  Button
} from 'reactNativeBasicComponents'

import {
  colors
} from '../../utils'

const defaultCameraProps = {
  type: 'back',
  autoFocus: true,
  permissionDialogTitle: 'Permission to use camera',
  permissionDialogMessage: 'We need your permission to use your camera phone'
}

class Camera extends React.PureComponent {
  takePicture = async function () {
    if (this.camera) {
      this.props.handleStateValue('showProgress', true)
      const options = { quality: 0.5, base64: true }
      this.camera.takePictureAsync(options)
        .then(data => {
          this.props.handleStateValue('openCameraView', false)
          this.props.onCapture(data.uri, '', 'camera')
        })
        .catch(err => {
          console.log('error in taking picture :- ', err)
        })
    }
  }

  render () {
    console.log('in camera render')
    return (
      <View style={styles.cameraContainer}>
        <RNCamera
          ref={ref => {
            this.camera = ref
          }}
          style={styles.camera}
          {...Object.assign({}, defaultCameraProps, this.props.cameraProps)}
        />
        <View style={styles.cameraButtonContainer}>
          <Button
            style={buttonStyles}
            buttonContainerStyle={styles.buttonContainerStyle}
            text={'Capture Image'}
            onPress={this.takePicture.bind(this)}
          />
          <Button
            style={buttonStyles}
            buttonContainerStyle={styles.buttonContainerStyle}
            text={'Upload Files'}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    position: 'relative'
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: null,
    width: null
  },
  cameraButtonContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  buttonContainerStyle: {
    padding: 0
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  }
})

const buttonStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    height: 48
  },
  text: {
    color: colors.white
  }
})

export default Camera
