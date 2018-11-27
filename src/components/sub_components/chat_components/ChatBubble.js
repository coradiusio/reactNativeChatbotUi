import React from 'react'

import {
  View,
  StyleSheet
} from 'react-native'

class ChatBubble extends React.PureComponent {
  render () {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.props.children}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 4
  }
})

export default ChatBubble
