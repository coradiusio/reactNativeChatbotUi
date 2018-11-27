import React from 'react'

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity
} from 'react-native'

import { isUndefined } from 'lodash'

import {
  Icon,
  Loader,
  RadioChoices
} from 'reactNativeBasicComponents'

import SenderChatBubble from './sub_components/chat_components/SenderChatBubble'
import ReceiverChatBubble from './sub_components/chat_components/ReceiverChatBubble'
import ChatBubble from './sub_components/chat_components/ChatBubble'
import TypingIndicator from './sub_components/chat_components/TypingIndicator'

import {
  massageText,
  formatAMPM
} from '../utils'

import {
  colors
} from '../general'

let checkBoxDisplayValueList = []
let checkBoxActualValueList = []

class Body extends React.PureComponent {
  scrollToBottom () {
    if (this.scrollView) {
      this.scrollView.scrollToEnd({ animated: true })
    }
  }

  radioChoices = (message, currentQuestion) => {
    if (message.radioOptions) {
      return (
        <RadioChoices
          choices={message.radioOptions}
          onChange={(option) => {
            if (message.node === currentQuestion.node) {
              this.props.submitInputValue(currentQuestion, option.label, option.value, 'radio')
            }
          }}
          buttonsContainerStyle={styles.buttonsContainer}
          containerStyle={styles.buttonContainer}
          fillContainerStyle={styles.fillContainer}
        />
      )
    }
  }

  checkboxChoices = (message) => {
    if (message.checkboxOptions) {
      return message.checkboxOptions.map((option, index) => {
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
      result,
      messages,
      currentQuestion,
      loader,
      role,
      botMode
    } = this.props

    console.log('messages :- ', messages)

    let leftOrRight = 'left'
    let differentSender = false

    return (
      <View style={styles.flexView}>
        {
          this.props.noMessageAvailable
            ? <Loader color={loader.color} size={'large'} />
            : <ScrollView
              style={styles.flexView}
              ref={ref => {
                this.scrollView = ref
              }}
              onContentSizeChange={() => this.scrollToBottom()}
              keyboardShouldPersistTaps='always'
            >
              <View style={styles.container}>
                {
                  messages.map((message, index) => {
                    leftOrRight = message.creator.type === role.type ? 'right' : 'left'
                    differentSender = (
                      index === 0 || (messages[index - 1].creator.type !== messages[index].creator.type)
                    )
                    return (
                      <View key={index}>
                        {
                          isUndefined(message.isAnswer)
                            ? <View>
                              {
                                leftOrRight === 'left'
                                  ? <ReceiverChatBubble
                                    text={message.text}
                                    showName={differentSender}
                                    creator={message.creator.displayName}
                                    showTime={(botMode === 'chat' || (botMode === 'question' && message.showTime))}
                                    time={message.createdAt}
                                  />
                                  : <SenderChatBubble
                                    text={message.text}
                                  />
                              }
                            </View>
                            : <View>
                              {
                                message.widget === 'radio'
                                  ? this.radioChoices(message, currentQuestion)
                                  : <View />
                              }
                            </View>
                        }
                      </View>
                    )
                  })
                }
                {
                  this.props.isReceiverTyping
                    ? <ReceiverChatBubble isTyping />
                    : null
                }
                {
                  this.props.isSenderTyping
                    ? <SenderChatBubble isTyping />
                    : null
                }
              </View>
            </ScrollView>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8
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
  errorIconContainer: {
    marginRight: 8
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
  buttonsContainer: {
    marginBottom: 0
  },
  buttonContainer: {
    borderColor: colors.primary
  },
  fillContainer: {
    backgroundColor: colors.primary
  },
  imageContainer: {
    width: 270,
    height: 270
  },
  image: {
    flex: 1,
    width: null,
    height: null
  }
})

export default Body
