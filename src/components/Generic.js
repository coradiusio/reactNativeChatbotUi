import React from 'react'

import {
  View,
  StyleSheet
} from 'react-native'

import { isUndefined } from 'lodash'

import SenderChatBubble from './sub_components/chat_components/SenderChatBubble'
import ReceiverChatBubble from './sub_components/chat_components/ReceiverChatBubble'
import ErrorBubble from './sub_components/chat_components/ErrorBubble'
import Date from './sub_components/chat_components/Date'

import RadioButtons from './sub_components/chat_components/RadioButtons'

import {
  massageText,
  formatAMPM,
  isValidDate,
  compareDate
} from '../utils'

import {
  colors
} from '../general'

let checkBoxDisplayValueList = []
let checkBoxActualValueList = []
let baseDate = (new Date('1970-01-01T00:00:00.000Z')).toString()
let toShowDateComponent = false
let dateObject

class Generic extends React.PureComponent {
  radioChoices = (message, currentQuestion) => {
    if (message.widget.options) {
      return (
        <RadioButtons
          message={message}
          currentQuestion={currentQuestion}
          submitInputValue={this.props.submitInputValue}
          pointerEvents={message.node === currentQuestion.node ? 'auto' : 'none'}
          value={message.state.value || ''}
        />
      )
    }
  }

  checkboxChoices = (message) => {
    if (message.widget.options) {
      return message.widget.options.map((option, index) => {
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

    leftOrRight = item.creator.type === this.props.role.type ? 'right' : 'left'
    differentSender = (
      index === 0 || (this.props.messages[index - 1].creator.type !== this.props.messages[index].creator.type)
    )

    if (item.isError) {
      return (
        <View key={index}>
          {
            differentSender
              ? <View style={styles.verticalSpacing} />
              : null
          }
          <ErrorBubble errorMessage={item.text} />
        </View>
      )
    } else if (item.isReceiverTyping) {
      return (
        <View>
          {
            differentSender
              ? <View style={styles.verticalSpacing} />
              : null
          }
          <ReceiverChatBubble isTyping />
        </View>
      )
    } else if (item.isSenderTyping) {
      return (
        <View>
          {
            differentSender
              ? <View style={styles.verticalSpacing} />
              : null
          }
          <SenderChatBubble isTyping />
        </View>
      )
    }

    toShowDateComponent = false

    if (isValidDate(item.createdAt)) {
      dateObject = item.createdAt
    } else if (typeof item.createdAt === 'string') {
      dateObject = (new Date(item.createdAt)).toString()
    }

    if (compareDate(dateObject, baseDate)) {
      toShowDateComponent = true
      baseDate = (new Date(dateObject.props)).toString()
    }

    return (
      <View key={index}>
        {
          toShowDateComponent && dateObject
            ? <Date date={dateObject} />
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
                    text={item.text}
                    showName={differentSender}
                    creator={item.creator.displayName}
                    showTime={(botMode === 'chat' || (botMode === 'question' && item.showTime))}
                    time={item.createdAt}
                  />
                  : <SenderChatBubble
                    text={item.text}
                    showTime
                    time={item.createdAt}
                  />
              }
            </View>
            : <View>
              {
                item.widget.type === 'radio'
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
  }
})

export default Generic
