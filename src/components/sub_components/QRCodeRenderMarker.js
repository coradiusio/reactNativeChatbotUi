import React from 'react'

import {
  StyleSheet,
  View,
  Animated,
  Easing,
  Dimensions,
  TouchableOpacity
} from 'react-native'

import {
  Icon
} from 'reactNativeBasicComponents'

const windowObject = Dimensions.get('window')

export default class QRCodeRenderMarker extends React.PureComponent {
  constructor (props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
  }

  componentDidMount () {
    this.animate()
  }

  animate () {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear
      }
    ).start(() => this.animate())
  }

  render () {
    const {
      primaryColor,
      borderWidth
    } = this.props

    const movingMargin = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 220, 0]
    })

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
            <Animated.View
              style={{
                marginTop: movingMargin
              }}
              useNativeDriver
            >
              <View style={{ height: 1, marginBottom: 2, backgroundColor: primaryColor }} />
              <View style={{ height: 2, marginBottom: 2, backgroundColor: primaryColor }} />
              <View style={{ height: 3, backgroundColor: primaryColor }} />
            </Animated.View>
          </View>
          <View style={[styles.flex, styles.transparentBackground]} />
        </View>
        <View style={[styles.flex, styles.transparentBackground, styles.bottomContainer]}>
          <TouchableOpacity
            onPress={() => this.props.toggleFlash()}
          >
            <Icon
              color={primaryColor}
              name={this.props.flashMode === 'torch' ? 'flash-off' : 'flash'}
              type='material-community'
              size={24}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
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
    backgroundColor: 'transparent',
    position: 'relative'
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
