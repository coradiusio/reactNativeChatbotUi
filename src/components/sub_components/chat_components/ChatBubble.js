import React from 'react'

import {
  StyleSheet
} from 'react-native'

import * as Animatable from 'react-native-animatable'

class ChatBubble extends React.PureComponent {
  render () {
    return (
      <Animatable.View
        animation={this.props.isError ? 'shake' : 'fadeIn'}
        duration={500}
        useNativeDriver
        style={[styles.container, this.props.style]}
      >
        {this.props.children}
      </Animatable.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4
  }
})

export default ChatBubble
