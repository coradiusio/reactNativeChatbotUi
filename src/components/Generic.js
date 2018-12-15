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

import RadioButtons from './sub_components/chat_components/RadioButtons'

import {
  massageText,
  formatAMPM,
  isValidDate
} from '../utils'

import {
  colors
} from '../general'

let checkBoxDisplayValueList = []
let checkBoxActualValueList = []
let baseDate
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
          <ErrorBubble errorMessage={item.text} />
        </View>
      )
    }// else if (item.isReceiverTyping) {
    //   return (
    //     <View>
    //       {
    //         differentSender
    //           ? <View style={styles.verticalSpacing} />
    //           : null
    //       }
    //       <ReceiverChatBubble isTyping />
    //     </View>
    //   )
    // } else if (item.isSenderTyping) {
    //   return (
    //     <View>
    //       {
    //         differentSender
    //           ? <View style={styles.verticalSpacing} />
    //           : null
    //       }
    //       <SenderChatBubble isTyping />
    //     </View>
    //   )
    // }

    toShowDateComponent = false

    dateObject = dayjs(item.createdAt)

    if (!dayjs(dateObject).isSame(dayjs(baseDate), 'date')) {
      toShowDateComponent = true
      baseDate = dayjs(dateObject)
    } else {
      toShowDateComponent = false
    }

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
                    text={item.message.text}
                    showName={differentSender}
                    sender={item.sender.displayName}
                    showTime={(botMode === 'chat' || (botMode === 'question' && item.showTime))}
                    time={item.createdAt}
                  />
                  : <SenderChatBubble
                    text={item.message.text}
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
