import React from 'react'

import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

import {
  Icon
} from 'reactNativeBasicComponents'

import {
  colors
} from '../../utils'

export default class CameraControl extends React.PureComponent {
  render () {
    return (
      <View style={styles.cameraIconsContainer}>
        <TouchableOpacity
          onPress={() => this.props.toggleFlash()}
        >
          <View style={styles.iconContainer} elevation={2}>
            <Icon
              color={colors.primary}
              name={this.props.flashMode === 'torch' ? 'flash-off' : 'flash'}
              type='material-community'
              size={24}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.handleIsPictureCapturing(true)}
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
          onPress={() => this.props.handleDocuments()}
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
    )
  }
}

const styles = StyleSheet.create({
  cameraIconsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
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
  }
})
