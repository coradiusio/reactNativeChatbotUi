import React from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

import {
  Icon,
  Loader,
  RadioChoices
} from 'reactNativeBasicComponents';

import ChatBubble from './sub_components/ChatBubble';
import TypingIndicator from './sub_components/TypingIndicator';

import {
  massageText,
  formatAMPM
} from '../utils';

import {
  colors
} from '../general';

let checkBoxDisplayValueList = [];
let checkBoxActualValueList = [];

class Body extends React.PureComponent {

  scrollToBottom () {
    if (this.scrollView) {
      this.scrollView.scrollToEnd({animated: true});
    }
  }

  radioChoices = (repliedMessage, currentQuestion) => {
    if (repliedMessage.radioOptions) {
      return (
        <RadioChoices
          choices={repliedMessage.radioOptions}
          onChange={(option) => {
            if (repliedMessage.node === currentQuestion.node) {
              this.props.submitInputValue(currentQuestion, option.label, option.value, 'radio');
            }
          }}
          buttonsContainerStyle={styles.buttonsContainer}
          containerStyle={styles.buttonContainer}
          fillContainerStyle={styles.fillContainer}
        />
      );
    } else return;
  }

  checkboxChoices = (repliedMessage) => {
    if (repliedMessage.checkboxOptions) {
      return repliedMessage.checkboxOptions.map((option, index) => {
        return (
          <div key={index}>
            <label>
              <input
                type="checkbox"
                defaultValue={option.value}
                dataLabel={option.label}
                onChange={(e) => {
                  if (e.target.checked) {
                    checkBoxActualValueList.push(e.target.value);
                    checkBoxDisplayValueList.push(e.target.attributes.datalabel.value);
                  } else {
                    let index = checkBoxActualValueList.indexOf(e.target.value);
                    if (index > -1) {
                      checkBoxActualValueList.splice(index, 1);
                    }
                    index = checkBoxDisplayValueList.indexOf(e.target.attributes.datalabel.value);
                    if (index > -1) {
                      checkBoxDisplayValueList.splice(index, 1);
                    }
                  }
                }}
              />
              <span>
                <span></span>
              </span> {option.label}
            </label>
          </div>
        );
      });
    } else return;
  }

  render() {
    const {
      result,
      messages,
      currentQuestion,
      loader
    } = this.props;

    let leftOrRight = 'left', differentSender = false;

    return (
      <View style={styles.flexView}>
        {
          this.props.noMessageAvailable
          ?
            <Loader color={loader.color} size={'large'} />
          :
            <ScrollView
              style={styles.flexView}
              ref={ref => this.scrollView = ref}
              onContentSizeChange={() => this.scrollToBottom()}
              keyboardShouldPersistTaps='always'
            >
              <View style={styles.container}>
                {
                  messages.map((repliedMessage, index) => {
                    leftOrRight = repliedMessage.sender === 'user' ? 'right' : 'left';
                    differentSender = (
                      index === 0 || (messages[index -1].sender !== messages[index].sender)
                    );
                    return (
                      <View key={index}>
                        {
                          repliedMessage.isAnswer === undefined
                          ?
                            <ChatBubble float={leftOrRight} widget={repliedMessage.widget}>
                              {
                                messages[index].sender === 'bot' && differentSender
                                ?
                                  <Text
                                    style={leftOrRight === 'left' ? styles.leftChatText : styles.rightChatText}
                                  >
                                    {repliedMessage.sender === 'user' ? 'User' : 'Bot'}
                                  </Text>
                                : 
                                  null
                              }
                              {
                                repliedMessage.source !== 'file' && repliedMessage.source !== 'camera'
                                ?
                                  <View style={styles.flexDirectionRow}>
                                    {
                                      repliedMessage.errorMessage
                                      ?
                                        <View style={styles.errorIconContainer}>
                                          <Icon
                                            color={colors.errorIconColor}
                                            name={'error'}
                                            type={'material-icon'}
                                            size={16}
                                          />
                                        </View>
                                      :
                                        null
                                    }
                                    <View
                                      style={styles.minWidth}
                                    >
                                      <Text
                                        style={[
                                          leftOrRight === 'left' ? styles.leftChatText : styles.rightChatText,
                                          leftOrRight === 'right' ? styles.rightChatTextRightText : null
                                        ]}
                                      >
                                        {massageText(repliedMessage.text, result)}
                                      </Text>
                                    </View>
                                    
                                  </View>
                                :
                                  <View>
                                    {
                                      ['jpeg', 'jpg', 'png'].indexOf(repliedMessage.fileExtension.trim().toLowerCase()) > -1
                                      ?
                                        <View style={styles.imageContainer}>
                                          <Image
                                            style={styles.image}
                                            source={{uri: repliedMessage.fileURL}}
                                          />
                                        </View>
                                      :
                                        null
                                    }
                                    <Text
                                      style={[
                                        leftOrRight === 'left' ? styles.leftChatText : styles.rightChatText,
                                        leftOrRight === 'right' ? styles.rightChatTextRightText : null
                                      ]}
                                    >
                                      {`${repliedMessage.fileName}.${repliedMessage.fileExtension}`}
                                    </Text>
                                  </View>
                              }
                              {
                                repliedMessage.showTime
                                ?
                                  <View style={leftOrRight === 'left' ? styles.timeContainer : styles.timeEditContainer}>
                                    <Text
                                      style={[
                                        leftOrRight === 'left' ? styles.leftChatText : styles.rightChatText,
                                        styles.timeString
                                      ]}
                                    >
                                      {formatAMPM(repliedMessage.createdAt)}
                                    </Text>
                                    {
                                      leftOrRight === 'right' && !repliedMessage.isError
                                      ?
                                        <TouchableOpacity>
                                          <Icon
                                            color={colors.rightChatText}
                                            name={'pencil'}
                                            type={'material-community'}
                                            size={16}
                                          />
                                        </TouchableOpacity>
                                      :
                                        null
                                    }
                                  </View>
                                :
                                  null
                              }
                            </ChatBubble>
                          :
                            <View>
                              {
                                repliedMessage.widget === 'radio'
                                ?
                                  this.radioChoices(repliedMessage, currentQuestion)
                                :
                                  <View>
                                    
                                  </View>
                              }
                            </View>
                        }
                      </View>
                    );
                  })
                }
                {
                  this.props.isBotTyping
                  ?
                    <View style={styles.leftTypingContainer}>
                      <TypingIndicator float='left' color={colors.leftChatText} />
                    </View>
                    
                  :
                    null
                }
                {
                  this.props.isUserTyping
                  ?
                    <View style={styles.rightTypingContainer}>
                      <TypingIndicator float='right' color={colors.rightChatText} />
                    </View>
                  :
                    null
                }
              </View>
            </ScrollView>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  flexView: {
    flex: 1,
  },
  leftChatText: {
    color: colors.leftChatText,
  },
  rightChatText: {
    color: colors.rightChatText,
  },
  minWidth: {
    minWidth: '25%',
  },
  rightChatTextRightText: {
    alignSelf: 'flex-start',
  },
  flexDirectionRow: {
    flexDirection: 'row',
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
    marginBottom: 0,
  },
  buttonContainer: {
    borderColor: colors.primary,
  },
  fillContainer: {
    backgroundColor: colors.primary,
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
});

export default Body;