import React from 'react'

import {
  View,
  StyleSheet,
  Image as ReactNativeImage
} from 'react-native'

export default class Image extends React.PureComponent {
  constructor (props) {
    super(props)

    this.state = {

    }
  }
  render () {
    const {
      attachment
    } = this.props

    return (
      <View style={styles.imageContainer}>
        <ReactNativeImage
          source={{ isStatic: true, uri: attachment.payload.base64 || attachment.payload.url }}
          resizeMode='cover'
          style={styles.image}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    width: 270,
    height: 270
  },
  image: {
    flex: 1,
    width: null,
    height: null
  }
})
