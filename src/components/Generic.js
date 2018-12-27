import React from 'react'

import {
  View,
  StyleSheet
} from 'react-native'

import { isUndefined } from 'lodash'
import dayjs from 'dayjs'

import SenderChatBubble from './sub_components/chat_components/SenderChatBubble'
import ReceiverChatBubble from './sub_components/chat_components/ReceiverChatBubble'
import ErrorBubble from './sub_components/chat_components/ErrorBubble'
import DateComponent from './sub_components/chat_components/DateComponent'
import Image from './sub_components/chat_components/Image'
import RadioButtons from './sub_components/chat_components/RadioButtons'

import {
  colors,
  massageText
} from '../utils'

let checkBoxDisplayValueList = []
let checkBoxActualValueList = []
let baseDate
let toShowDateComponent = false
let dateObject

class Generic extends React.PureComponent {
  radioChoices = (item, currentQuestion) => {
    if (item.message.quick_replies) {
      return (
        <RadioButtons
          message={item.message}
          messageId={item.messageId}
          isEditingMode={this.props.isEditingMode}
          pointerEvents={
            (item.node === currentQuestion.node) || (this.props.isEditingMode && this.props.currentEditingAnswerOptionsMessageId === item.messageId)
              ? 'auto'
              : 'none'
          }
          value={item.state.value || ''}
          handleRadioButton={this.props.handleRadioButton}
        />
      )
    }
  }

  checkboxChoices = (message) => {
    if (message.quick_replies) {
      return message.quick_replies.map((option, index) => {
        return (
          <div key={index}>
            <label>
              <input
                type='checkbox'
                defaultValue={option.value}
                dataLabel={option.label}
                onChange={(e) => {
                  if (e.target.checked) {
                    checkBoxActualValueList.push(e.target.value)
                    checkBoxDisplayValueList.push(e.target.attributes.datalabel.value)
                  } else {
                    let index = checkBoxActualValueList.indexOf(e.target.value)
                    if (index > -1) {
                      checkBoxActualValueList.splice(index, 1)
                    }
                    index = checkBoxDisplayValueList.indexOf(e.target.attributes.datalabel.value)
                    if (index > -1) {
                      checkBoxDisplayValueList.splice(index, 1)
                    }
                  }
                }}
              />
              <span>
                <span />
              </span> {option.label}
            </label>
          </div>
        )
      })
    }
  }

  render () {
    const {
      item,
      index
    } = this.props

    let leftOrRight = 'left'
    let differentSender = false
    let botMode = this.props.botMode

    leftOrRight = item.sender.type === this.props.role.type ? 'right' : 'left'
    differentSender = (
      index === 0 || (this.props.messages[index - 1].sender.type !== this.props.messages[index].sender.type)
    )

    if (item.index === 0) {
      baseDate = dayjs('1970-01-01')
    }

    if (item.isError) {
      return (
        <View key={index}>
          {
            differentSender
              ? <View style={styles.verticalSpacing} />
              : null
          }
          <ErrorBubble errorMessage={item.message.text} />
        </View>
      )
    }

    toShowDateComponent = false

    dateObject = dayjs(item.createdAt)

    if (!dayjs(dateObject).isSame(dayjs(baseDate), 'date')) {
      toShowDateComponent = true
      baseDate = dayjs(dateObject)
    } else {
      toShowDateComponent = false
    }

    const {
      text,
      attachment
    } = item.message || {}

    return (
      <View key={index}>
        {
          toShowDateComponent && dateObject
            ? <DateComponent date={dateObject} />
            : null
        }
        {
          differentSender
            ? <View style={styles.verticalSpacing} />
            : null
        }
        {
          isUndefined(item.isAnswerOptions)
            ? <View>
              {
                leftOrRight === 'left'
                  ? <ReceiverChatBubble
                    text={text}
                    showName={differentSender}
                    sender={item.sender.displayName}
                    showTime={(botMode === 'chat' || (botMode === 'question' && item.showTime))}
                    time={item.createdAt}
                  >
                    {
                      attachment && attachment.type === 'image'
                        ? <Image
                          attachment={attachment}
                        />
                        : null
                    }
                  </ReceiverChatBubble>
                  : <SenderChatBubble
                    text={item.rawValue ? massageText((item.rawValue || text), item.state) : text}
                    messageId={item.messageId}
                    showTime
                    time={item.createdAt}
                    isEditable={item.isRightAnswer}
                    handleEditPress={this.props.handleEditPress}
                    handleFinishedEdit={this.props.handleFinishedEdit}
                    currentEditingMessageId={this.props.currentEditingMessageId}
                  >
                    {
                      attachment && attachment.type === 'image'
                        ? <Image
                          attachment={attachment}
                        />
                        : null
                    }
                  </SenderChatBubble>
              }
            </View>
            : <View style={styles.radioContainer}>
              {
                item.input.widget === 'radio'
                  ? this.radioChoices(item, this.props.currentQuestion)
                  : <View />
              }
            </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  flexView: {
    flex: 1
  },
  leftChatText: {
    color: colors.leftChatText
  },
  rightChatText: {
    color: colors.rightChatText
  },
  minWidth: {
    minWidth: '25%'
  },
  rightChatTextRightText: {
    alignSelf: 'flex-start'
  },
  flexDirectionRow: {
    flexDirection: 'row'
  },
  timeString: {
    fontSize: 10
  },
  timeContainer: {
    alignItems: 'flex-end'
  },
  timeEditContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  leftTypingContainer: {
    height: 40
  },
  rightTypingContainer: {
    height: 68
  },
  imageContainer: {
    width: 270,
    height: 270
  },
  image: {
    flex: 1,
    width: null,
    height: null
  },
  verticalSpacing: {
    flex: 1,
    height: 4
  },
  flatlistContentContainer: {
    padding: 8
  },
  radioContainer: {
    marginLeft: 36
  }
})

export default Generic
