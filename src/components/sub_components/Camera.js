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
} from '../../general'

class Camera extends React.PureComponent {
  takePicture = async function () {
    if (this.camera) {
      const options = { quality: 0.5, base64: true }
      const data = await this.camera.takePictureAsync(options)
      console.log(data.uri)
      this.props.onCapture(data.uri, '', 'camera')
      this.props.handleStateValue('openCameraView', false)
    }
  }

  render () {
    return (
      <View style={styles.cameraContainer}>
        <RNCamera
          ref={ref => {
            this.camera = ref
          }}
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          autoFocus
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
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
