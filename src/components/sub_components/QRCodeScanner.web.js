import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  StyleSheet,
  View,
  Dimensions
} from 'react-native'

import {
  colors
} from '../../utils'

const windowObject = Dimensions.get('window')

export default class QRCodeScanner extends Component {

  render () {
    return (
      <View style={[styles.flex, this.props.containerStyle]}>
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
