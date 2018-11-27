import React from 'react'

import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import TypingIndicator from './TypingIndicator'
import ChatBubble from './ChatBubble'
import Time from './Time'

import {
  colors
} from '../../../general'

class ReceiverChatBubble extends React.PureComponent {
  render () {
    return (
      <ChatBubble style={styles.container}>
        <View style={styles.innerContainer}>
          {
            this.props.isTyping
              ? <TypingIndicator color={colors.receiverBubbleText} size={10} count={3} />
              : <View>
                {
                  this.props.showName
                    ? <Text
                      style={[styles.specialFont, styles.fontColor]}
                    >
                      Bot
                    </Text>
                    : null
                }
                {this.props.children}
                {
                  this.props.text
                    ? <Text style={styles.fontColor}>
                      {this.props.text}
                    </Text>
                    : null
                }
                {
                  this.props.showTime
                    ? <Time
                      containerStyle={styles.rightAlign}
                      textStyle={styles.fontColor}
                      text='12:45PM'
                    />
                    : null
                }
              </View>
          }
        </View>
      </ChatBubble>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start'
  },
  innerContainer: {
    maxWidth: '85%',
    minWidth: 100,
    backgroundColor: colors.receiverBubbleBackground,
    borderRadius: 4,
    borderTopLeftRadius: 0,
    padding: 8,
    paddingRight: 12
  },
  fontColor: {
    color: colors.receiverBubbleText
  },
  specialFont: {
    fontWeight: 'bold'
  },
  rightAlign: {
    alignSelf: 'flex-end'
  }
})

export default ReceiverChatBubble
