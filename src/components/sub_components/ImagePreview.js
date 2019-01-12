import React from 'react'

import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native'

import {
  Icon
} from 'reactNativeBasicComponents'

import {
  colors,
  genericColors
} from '../../utils'

export default class ImagePreview extends React.PureComponent {
  render () {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: this.props.pictureData.uri }}
          style={styles.imagePreview}
          resizeMode='contain'
        />
        <View style={styles.correctIncorrectContainer}>
          <View style={styles.iconsContainer} elevation={1}>
            <TouchableOpacity
              onPress={() => this.props.resetPicture()}
              style={styles.oneIconContainer}
            >
              <Icon
                color={colors.errorIconColor}
                name={'md-close'}
                type='ion'
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.submitPicture()}
              style={[styles.oneIconContainer, { borderRightWidth: 0 }]}
            >
              <Icon
                color={colors.primary}
                name={'md-checkmark'}
                type='ion'
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
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
