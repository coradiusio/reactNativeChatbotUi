import React from 'react'

import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import {
  Icon
} from 'reactNativeBasicComponents'

import ChatBubble from './ChatBubble'
import Time from './Time'

import {
  colors,
  formatAMPM
} from '../../../utils'

class ReceiverChatBubble extends React.PureComponent {
  render () {
    const {
      showName,
      showTime
    } = this.props

    return (
      <ChatBubble style={styles.container} isError={this.props.isError}>
        <View style={styles.iconContainer}>
          {
            showName
              ? <Icon
                color={colors.primary}
                name={'robot-vacuum'}
                type={'material-community'}
                size={32}
              />
              : null
          }
        </View>
        <View style={[styles.innerContainer, !showName ? styles.explicitMargin : null]}>
          {
            showName
              ? <Text
                style={styles.senderName}
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
            showTime
              ? <Time
                textStyle={styles.timeStyle}
                text={formatAMPM(this.props.time)}
              />
              : null
          }
        </View>
      </ChatBubble>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row'
  },
  iconContainer: {
    marginRight: 4
  },
  innerContainer: {
    maxWidth: '75%',
    minWidth: 100,
    backgroundColor: colors.receiverBubbleBackground,
    borderRadius: 4,
    padding: 8,
    paddingRight: 12
  },
  explicitMargin: {
    marginLeft: 32
  },
  senderName: {
    fontSize: 11,
    color: colors.primary
  },
  timeStyle: {
    color: colors.receiverTimeText,
    fontSize: 8
  },
  fontColor: {
    color: colors.receiverBubbleText
  }
})

export default ReceiverChatBubble
