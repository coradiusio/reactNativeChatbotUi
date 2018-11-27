import React from 'react'

import {
  View,
  StyleSheet
} from 'react-native'

import {
  DotIndicator
} from 'reactNativeBasicComponents'

class TypingIndicator extends React.PureComponent {
  render () {
    return (
      <View style={styles.container}>
        <DotIndicator color={this.props.color} size={this.props.size || 10} count={this.props.count || 3} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    height: 25
  }
})

export default TypingIndicator
