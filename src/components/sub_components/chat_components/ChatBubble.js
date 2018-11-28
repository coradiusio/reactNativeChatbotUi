import React from 'react'

import {
  View,
  StyleSheet
} from 'react-native'

import * as Animatable from 'react-native-animatable'

class ChatBubble extends React.PureComponent {
  elementToBeRendered () {
    let element
    if (this.props.isTyping) {
      element = (
        <View
          style={[styles.container, this.props.style]}
        >
          {this.props.children}
        </View>
      )
    } else if (this.props.isError) {
      element = (
        <Animatable.View
          animation='shake'
          duration={500}
          useNativeDriver
          style={[styles.container, this.props.style]}
        >
          {this.props.children}
        </Animatable.View>
      )
    } else {
      element = (
        <Animatable.View
          animation='fadeIn'
          duration={500}
          useNativeDriver
          style={[styles.container, this.props.style]}
        >
          {this.props.children}
        </Animatable.View>
      )
    }

    return element
  }
  render () {
    return this.elementToBeRendered()
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4
  }
})

export default ChatBubble
