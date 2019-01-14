import React from 'react'

import {
  View,
  StyleSheet
} from 'react-native'

import {
  hasGetUserMedia,
  genericColors
} from '../../utils'

class Camera extends React.PureComponent {
  componentDidMount () {
    this.renderCamera()
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isPictureCapturingStart) {
      this.takePicture()
    }
  }

  takePicture = async function () {
    const mediaStreamTrack = window.stream.getVideoTracks()[0]
    const imageCapture = new ImageCapture(mediaStreamTrack)
    if (imageCapture) {
      this.props.handleStateValue('showProgress', true)
      imageCapture.takePhoto()
        .then(blob => {
          this.props.handlePictureTaken(URL.createObjectURL(blob))
          this.props.handleStateValue('showProgress', false)
        })
        .catch(error => console.error('takePhoto() error:', error))
    }
  }

  renderCamera () {
    console.log('rendering camera')
    if (hasGetUserMedia()) {
      const videoElement = document.getElementById('camera-stream')

      const constraints = { audio: false }

      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const videoOutputs = devices.filter(device => device.kind === 'videoinput')

          // we didn't find any video input
          if (videoOutputs.length === 0) {
            throw new Error('no video input')
          }

          if (videoOutputs.length > 1) {
            constraints.video = { facingMode: { exact: 'environment' } }
          } else {
            constraints.video = { deviceid: undefined }
          }

          // constraints.video.width = { min: 1280, ideal: 1920 }
          // constraints.video.height = { min: 720, ideal: 1080 }
          constraints.video.frameRate = { min: 30, ideal: 60 }
        }).then(() => {
          if (window.stream) {
            window.stream.getTracks().forEach(function (track) {
              track.stop()
            })
          }

          navigator.mediaDevices.getUserMedia(constraints)
            .then(mediaStream => {
              window.stream = mediaStream // make stream available to console
              videoElement.srcObject = mediaStream

              const track = mediaStream.getVideoTracks()[0]

              const onCapabilitiesReady = (capabilities) => {
                console.log(track.getSettings())

                /* if (capabilities.torch) {
                  track.applyConstraints({
                    advanced: [{torch: true}]
                  })
                  .catch(e => console.log(e));
                } */
                if (capabilities.focusMode) {
                  track.applyConstraints({
                    advanced: [{ focusMode: 'auto' }]
                  })
                    .catch(e => console.log(e))
                }
              }

              videoElement.addEventListener('loadedmetadata', (e) => {
                window.setTimeout(() => (
                  onCapabilitiesReady(track.getCapabilities())
                ), 500)
              })
            }).catch(err => {
              console.log('Error: ', err)
            })
        }).catch(err => {
          console.log('Error: ', err)
        })
    } else {
      alert('Your browser does not support getUserMedia')
    }
  }

  render () {
    return (
      <View style={styles.cameraContainer}>
        <video id='camera-stream' autoPlay muted />
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
  },
  imagePreview: {
    flex: 1,
    width: null,
    height: null
  },
  correctIncorrectContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center'
  },
  iconsContainer: {
    flexDirection: 'row',
    width: 200,
    backgroundColor: genericColors.white,
    borderRadius: 40
  },
  oneIconContainer: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderColor: genericColors.grey100
  }
})

export default Camera
