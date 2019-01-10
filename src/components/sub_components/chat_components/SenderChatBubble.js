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

import ChatBubble from './ChatBubble'
import Time from './Time'

import {
  colors,
  formatAMPM
} from '../../../utils'

class SenderChatBubble extends React.PureComponent {
  render () {
    const isEditingThisMessage = this.props.isEditable && this.props.currentEditingMessageId === this.props.messageId
    return (
      <ChatBubble style={styles.container}>
        <View style={[styles.innerContainer]}>
          {this.props.children}
          {
            this.props.text
              ? <Text style={styles.textStyle}>
                {this.props.text}
              </Text>
              : null
          }
          <View style={styles.editTimeContainer}>
            <Time
              textStyle={styles.timeStyle}
              text={formatAMPM(this.props.time)}
            />
          </View>
        </View>
        <View style={styles.iconContainer}>
          {
            !isEditingThisMessage
              ? <TouchableOpacity
                onPress={() => this.props.handleEditPress(this.props.messageId)}
              >
                <Icon
                  color={colors.primary}
                  name={'circle-edit-outline'}
                  type={'material-community'}
                  size={24}
                />
              </TouchableOpacity>
              : <TouchableOpacity
                onPress={() => this.props.handleFinishedEdit()}
              >
                <Icon
                  color={colors.primary}
                  name={'close-circle-outline'}
                  type={'material-community'}
                  size={24}
                />
              </TouchableOpacity>
          }
        </View>
      </ChatBubble>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    flexDirection: 'row'
  },
  iconContainer: {
    marginLeft: 4
  },
  innerContainer: {
    maxWidth: '85%',
    minWidth: 100,
    backgroundColor: colors.senderBubbleBackground,
    borderRadius: 4,
    padding: 8,
    paddingLeft: 12
  },
  explicitMargin: {
    marginRight: 28
  },
  textStyle: {
    textAlign: 'right',
    color: colors.senderBubbleText
  },
  timeStyle: {
    color: colors.senderTimeText,
    fontSize: 8
  },
  editTimeContainer: {
    alignItems: 'flex-end'
  }
})

export default SenderChatBubble
