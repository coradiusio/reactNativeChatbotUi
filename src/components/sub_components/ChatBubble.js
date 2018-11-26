import React from 'react'

import {
  View,
  StyleSheet
} from 'react-native'

import TalkBubble from './TalkBubble'

class ChatBubble extends React.PureComponent {
  render () {
    const { float = 'left' } = this.props
    return (
      <View style={float === 'right' ? styles.rightContainer : styles.leftContainer}>
        {
          this.props.widget === 'camera'
            ? <View>
              {this.props.children}
            </View>
            : <TalkBubble
              float={float}
            >
              {this.props.children}
            </TalkBubble>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  leftContainer: {
    alignSelf: 'flex-start'
  },
  rightContainer: {
    alignSelf: 'flex-end'
  }
})

export default ChatBubble
