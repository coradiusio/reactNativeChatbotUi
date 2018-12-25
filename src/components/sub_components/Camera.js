import React from 'react'

import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

import { RNCamera } from 'react-native-camera'
import { DocumentPicker,DocumentPickerUtil } from 'react-native-document-picker'

import {
  Icon
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
  constructor (props) {
    super(props)
    this.state = {
      flashMode: 'off'
    }

    this.toggleFlash = this.toggleFlash.bind(this)
  }

  takePicture = async function () {
    if (this.camera) {
      this.props.handleStateValue('showProgress', true)
      this.camera.takePictureAsync()
        .then(data => {
          this.props.handleStateValue('openCameraView', false)
          this.props.onCapture(data.uri, '', 'camera')
          this.props.handleStateValue('showProgress', false)
        })
        .catch(err => {
          console.log('error in taking picture :- ', err)
        })
    }
  }

  toggleFlash () {
    this.setState(prevState => ({
      flashMode: prevState.flashMode === 'torch' ? 'off' : 'torch'
    }))
  }

  render () {
    return (
      <View style={styles.cameraContainer}>
        <RNCamera
          ref={ref => {
            this.camera = ref
          }}
          style={styles.camera}
          type={this.props.cameraType}
          autoFocus
          flashMode={RNCamera.Constants.FlashMode[this.state.flashMode]}
          {...Object.assign({}, defaultCameraProps, this.props.cameraProps)}
        >
          <View style={styles.cameraIconsContainer}>
            <TouchableOpacity
              onPress={() => this.toggleFlash()}
            >
              <View style={styles.iconContainer} elevation={2}>
                <Icon
                  color={colors.primary}
                  name={this.state.flashMode === 'torch' ? 'flash' : 'flash-off'}
                  type='material-community'
                  size={24}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.takePicture()}
            >
              <View style={[styles.iconContainer, styles.bigIconContainer]} elevation={2}>
                <Icon
                  color={colors.primary}
                  name={'gesture-double-tap'}
                  type='material-community'
                  size={48}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                DocumentPicker.show({
                  filetype: [DocumentPickerUtil.allFiles()]
                }, (error, res) => {
                  if (error) {
                    console.log('error :- ', error)
                  } else {
                    console.log(
                      res.uri,
                      res.type, // mime type
                      res.fileName,
                      res.fileSize
                    )
                  }
                })
              }}
            >
              <View style={styles.iconContainer} elevation={2}>
                <Icon
                  color={colors.primary}
                  name={'file-image'}
                  type='material-community'
                  size={24}
                />
              </View>
            </TouchableOpacity>
          </View>
        </RNCamera>
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
  bigIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 64
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cameraIconsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  }
})

export default Camera
