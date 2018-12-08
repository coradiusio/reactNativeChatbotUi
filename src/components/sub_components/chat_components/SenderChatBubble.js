import React from 'react'

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

import {
  Icon
} from 'reactNativeBasicComponents'

import TypingIndicator from './TypingIndicator'
import ChatBubble from './ChatBubble'
import Time from './Time'

import {
  colors
} from '../../../general'

import {
  formatAMPM
} from '../../../utils'

class SenderChatBubble extends React.PureComponent {
  render () {
    return (
      <ChatBubble style={styles.container}>
        <View style={styles.innerContainer}>
          {
            this.props.isTyping
              ? <TypingIndicator color={colors.senderBubbleText} size={10} count={3} />
              : <View>
                {this.props.children}
                {
                  this.props.text
                    ? <Text style={styles.fontColor}>
                      {this.props.text}
                    </Text>
                    : null
                }
                <View style={styles.editTimeContainer}>
                  <Time
                    textStyle={styles.fontColor}
                    text={formatAMPM(this.props.time)}
                  />
                  <TouchableOpacity>
                    <Icon
                      color={colors.senderBubbleText}
                      name={'pencil'}
                      type={'material-community'}
                      size={16}
                    />
                  </TouchableOpacity>
                </View>
              </View>
          }
        </View>
      </ChatBubble>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end'
  },
  innerContainer: {
    maxWidth: '85%',
    minWidth: 100,
    backgroundColor: colors.senderBubbleBackground,
    borderRadius: 4,
    borderTopRightRadius: 0,
    padding: 8,
    paddingLeft: 12
  },
  fontColor: {
    color: colors.senderBubbleText
  },
  editTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  }
})

export default SenderChatBubble
