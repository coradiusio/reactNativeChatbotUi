import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView
} from 'react-native';

import axios from 'axios';
import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';

import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';

import Camera from './components/sub_components/Camera';

import {
  axiosConfig,

  massageText,
  validateInput,
  setValue,
  getValue,
  stringCases,
  stringCasing,
  validateFile,
} from './utils';

let timer;

export default class FormBotApp extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uiData: {
        header: {
          title: 'Chatbot Assistant',
          subtitle: 'online',
          icon: {
            name: 'robot',
            type: 'material-community',
            color: colors.white,
            size: 40
          },
          subtitleIcon: {
            name: 'circle',
            type: 'material-community',
            color: colors.green,
            size: 12
          },
        },
        loader: {
          color: colors.primary,
        },
        footer: {
          icon: {
            name: 'send',
            type: 'material-community',
            color: colors.primary,
            size: 32
          }
        }
      },
      result: {},
      currentMessageIndex: 0,
      messages: [],
      repliedMessages: [],
      isBotTyping: false,
      isUserTyping: false,
      isUserAllowedToAnswer: false,
      openCameraView: false
    };

    // setup socket connection
    this.app = feathers()
      .configure(socketio(io(this.props.host || 'http://localhost:7664', { transports: ['websocket'] })));

    this.messagesService = this.app.service('messages');

    this.submitInputValue = this.submitInputValue.bind(this);
    this.handleNextMessage = this.handleNextMessage.bind(this);
    this.handleStateValue = this.handleStateValue.bind(this);
    this.modifyResult = this.modifyResult.bind(this);
  }

  componentDidMount() {
    this.fetchMessagesHistory();
  }

  componentWillUnmount() {
    if (timer) {
      clearTimeout(timer);
    }

    this.app = null;
  }

  fetchMessagesHistory() {
    this.messagesService.find()
    .then(response => {
      this.updateMessages(response.data);
    })
    .catch(err => {
      console.log(err);
    })
  }

  updateMessages(messages) {
    this.setState(prevState => ({
      ...prevState,
      messages
    }));
  }

  handleStateValue(state, value) {
    this.setState({ [state]: value });
  }

  fetchNextQuestion() {

  }

  handleNextMessage() {
    this.setState({ isBotTyping: true, isUserAllowedToAnswer: false }, () => {
      timer = setTimeout(() => {
        const currentMessage = this.state.messages[this.state.messages.length - 1];

        if (currentMessage) {
          const message = currentMessage.message;

          const messageArray = message instanceof Array ? message : (typeof message === 'string' ? [message] : null);

          const { repliedMessages, currentMessageIndex } = this.state;

          if (messageArray) {
            if (currentMessageIndex === messageArray.length - 1) {
              repliedMessages.push({
                text: messageArray[currentMessageIndex],
                sender: 'bot',
                createdAt: currentMessage.createdAt,
                showTime: true
              });

              if (currentMessage.widget === 'radio' && currentMessage.radioOptions) {
                this.handleRadioOptions(currentMessage, repliedMessages);
              } else if (currentMessage.widget === 'checkbox' && currentMessage.checkboxOptions) {
                this.handleCheckboxOptions(currentMessage, repliedMessages);
              }

              this.setState({
                currentMessageIndex: 0,
                repliedMessages,
                isBotTyping: false,
                isUserAllowedToAnswer: true,
              });
            } else {
              repliedMessages.push({
                text: messageArray[currentMessageIndex],
                sender: 'bot'
              });

              this.setState({
                repliedMessages,
                isBotTyping: false,
                currentMessageIndex: currentMessageIndex + 1
              }, () => {
                this.handleNextMessage()
              });
            }
          }
        }
      }, 1000);
    });
  }

  handleRadioOptions(currentMessage, repliedMessages) {
    repliedMessages.push({
      widget: 'radio',
      radioOptions: currentMessage.radioOptions,
      node: currentMessage.node,
      isAnswer: true,
      sender: 'bot'
    });
  }

  handleCheckboxOptions(currentMessage, repliedMessages) {
    repliedMessages.push({
      widget: 'checkbox',
      checkboxOptions: currentMessage.checkboxOptions,
      joinWith: currentMessage.validateInput.joinWith || ',',
      node: currentMessage.node,
      isAnswer: true,
      sender: 'bot'
    });
  }

  // not using for now
  handleServerRequest(currentMessage) {
    const request = currentMessage.serverImplementation.request;
    const response = currentMessage.serverImplementation.response;
    const success = response && response.success;
    const successShowMessage = success && success.showMessage;
    const mandatoryConditions = success && success.mandatoryConditions;
    const error = response && response.error;
    const errorShowMessage = error && error.showMessage;

    let absoluteURL = `${request.baseURL}${request.endpoint}`;
    let requestType = request.type;

    if (requestType) {
      requestType = requestType.trim().toLowerCase();
      if (requestType === 'get') {
        if (typeof request.data === 'object') {
          absoluteURL = absoluteURL + '?';
          for (let key in request.data) {
            absoluteURL = absoluteURL + `${key}=${request.data[key]}&`;
          }
        }
        if (absoluteURL.endsWith('&')) {
          absoluteURL = absoluteURL.slice(0, -1);
        }

        if (request.showMessage) {
          const { repliedMessages } = this.state;
          repliedMessages.push({
            source: 'text',
            text: request.showMessage,
            sender: 'bot',
          });
          this.setState({ repliedMessages });
        }

        axios.get(absoluteURL, axiosConfig)
        .then((serverResponse) => {
          console.log('response :- ', serverResponse);
          this.handleServerResponse(serverResponse, successShowMessage, errorShowMessage, mandatoryConditions);
        }).catch((error) => {
          console.log('error :- ', error);
          const { repliedMessages } = this.state;
          repliedMessages.push({
            source: 'text',
            text: `${requestType.toUpperCase()} - ${absoluteURL} - error - ${error.message}`,
            sender: 'bot',
            errorMessage: true
          });

          if (response && response.error && response.error.showMessage) {
            repliedMessages.push({
              source: 'text',
              text: response && response.error && response.error.showMessage,
              sender: 'bot',
              errorMessage: true
            });
          }

          this.setState({ repliedMessages });
        });
      } else if (requestType === 'post') {
        let data = new FormData();
        if (requestType.headers) {
          axiosConfig.headers = requestType.headers;
        }
        if (typeof request.data === 'object') {
          for (let key in request.data) {
            data.append(key, typeof request.data[key] === 'string' ? massageText(request.data[key], this.state.result) : request.data[key]);
          }
        }

        if (request.showMessage) {
          const { repliedMessages } = this.state;
          repliedMessages.push({
            source: 'text',
            text: request.showMessage,
            sender: 'bot',
          });

          this.setState({ repliedMessages });
        }

        axios.post(absoluteURL, data, axiosConfig)
        .then((serverResponse) => {
          console.log('response :- ', serverResponse);
          this.handleServerResponse(serverResponse, successShowMessage, errorShowMessage, mandatoryConditions);
        }).catch((error) => {
          console.log('error :- ', error);
          const { repliedMessages } = this.state;
          repliedMessages.push({
            source: 'text',
            text: `${requestType.toUpperCase()} - ${absoluteURL} - error - ${error.message}`,
            sender: 'bot',
            errorMessage: true
          });

          if (response && response.error && response.error.showMessage) {
            repliedMessages.push({
              source: 'text',
              text: response && response.error && response.error.showMessage,
              sender: 'bot',
              errorMessage: true
            });
          }
          
          this.setState({ repliedMessages });
        });
      }
    }
  }

  // not using for now
  handleServerResponse(response, successShowMessage, errorShowMessage, mandatoryConditions) {
    if (response.data && typeof response.data === 'object') {
      const { result, repliedMessages } = this.state;
      for (var key in response.data) {
        if (key in result) {
          result[key] = response.data[key];
        }
      }

      let mandatoryConditionsCheckSuccess = false;
      if (mandatoryConditions && typeof mandatoryConditions === 'object') {
        for (let key in mandatoryConditions) {
          if (key in response.data && response.data[key] === mandatoryConditions[key]) {
            mandatoryConditionsCheckSuccess = true;
          }
          else {
            mandatoryConditionsCheckSuccess = false;
            break;
          }
        }
      }

      if (mandatoryConditions) {
        if (mandatoryConditionsCheckSuccess) {
          repliedMessages.push({
            source: 'text',
            text: successShowMessage,
            sender: 'bot',
          });
        } else {
          repliedMessages.push({
            source: 'text',
            text: errorShowMessage,
            sender: 'bot',
            errorMessage: true
          });
        }
        this.setState({ result, repliedMessages }, () => {
          this.handleNextMessage();
        });
      } else if (successShowMessage) {
        repliedMessages.push({
          source: 'text',
          text: successShowMessage,
          sender: 'bot',
        });
        this.setState({ result, repliedMessages }, () => {
          this.handleNextMessage();
        });
      } else {
        this.setState({ result }, () => {
          this.handleNextMessage();
        });
      }
    }
  }

  // not using for now
  modifyResult(currentMessage, answerInputModified) {
    const messageEntity = currentMessage.entity;
    const messagePath = currentMessage.entityPath;

    if (messageEntity) {
      const { result } = this.state;
      const validateInput = currentMessage.validateInput;
      const outputType = validateInput && validateInput.outputType;
      if (outputType === 'string' || outputType === 'number') {
        setValue(`${messagePath === undefined || messagePath === '' ? '' : '.'}${messageEntity}`, answerInputModified, result);
        this.setState({ result });
      } else if (outputType === 'array') {
        answerInputModified = answerInputModified.split(currentMessage.validateInput.joinWith || ',');
        setValue(`${messagePath === undefined || messagePath === '' ? '' : '.'}${messageEntity}`, answerInputModified, result);
        this.setState({ result });
      } else if (outputType === 'object') {
        // here we need to handle this carefully
        if (answerInputModified instanceof Array) {
          const answerInputModifiedLength = answerInputModified.length;
          const keys = validateInput.keys;
          let keyValueIndex;
          let keyValueIndexType;
          for (let i = 0; i < keys.length; i++) {
            keyValueIndex = keys[i].keyValueIndex;
            keyValueIndexType = typeof(keyValueIndex);
            if (keyValueIndexType === 'number') {
              setValue(`${messagePath === undefined || messagePath === '' ? '' : '.'}${messageEntity}.${keys[i].keyName}`, answerInputModified[keyValueIndex], result);
            } else if (keyValueIndexType === 'object') {
              const orConditions = keys[i].keyValueIndex.or;
              const andConditions = keys[i].keyValueIndex.and;

              // first follow OR then AND
              if (orConditions instanceof Array) {
                for (let j = 0; j < orConditions.length; j++) {
                  if (orConditions[j].inputLength === answerInputModifiedLength) {
                    setValue(`${messagePath === undefined || messagePath === '' ? '' : '.'}${messageEntity}.${keys[i].keyName}`, answerInputModified[orConditions[j].keyValueIndex], result);
                    break;
                  }
                } 
              }

              if (andConditions instanceof Array) {
                for (let k = 0; k < andConditions.length; k++) {
                  if (andConditions[k].inputLength === answerInputModifiedLength) {
                    setValue(`${messagePath === undefined || messagePath === '' ? '' : '.'}${messageEntity}.${keys[i].keyName}`, answerInputModified[andConditions[k].keyValueIndex], result);
                  }
                }
              }
            }

            if (keys[i].casing && stringCases.indexOf(keys[i].casing.trim().toLowerCase() > -1)) {
              const path = `${messagePath === undefined || messagePath === '' ? '' : '.'}${messageEntity}.${keys[i].keyName}`;
              const tempValue = getValue(path, result);
              if (tempValue) {
                setValue(
                  path,
                  stringCasing(tempValue, keys[i].casing.trim().toLowerCase()),
                  result
                );
              }
            }
          }
        }

        this.setState({ result });
      } else return;
    } else return;
  }

  submitInputValue(currentMessage, answerInput, formValue = '', source = 'text', fileName = '', fileExtension = '') {
    // first replace all spaces by single for safety
    answerInput = answerInput.replace(/\s\s+/g, ' ').trim();

    if (currentMessage.validateInput && currentMessage.validateInput.casing) {
      answerInput = stringCasing(answerInput, currentMessage.validateInput.casing.trim().toLowerCase());
    }

    const { repliedMessages } = this.state;

    let answerInputModified;
    if (formValue !== '') {
      answerInputModified = formValue.replace(/\s\s+/g, ' ').trim();
    } else {
      answerInputModified = answerInput.replace(/\s\s+/g, ' ').trim();
    }

    let fullFileName = '';
    if (source === 'camera') {
      fullFileName = answerInput.split('/').slice(-1)[0];
      fileName = fullFileName.split('.')[0];
      fileExtension = fullFileName.split('.')[1];
    }

    console.log('fileName :-', fileName);
    console.log('fileExtension :-', fileExtension);

    let inputValidatedObject;
    if (source !== 'file' && source !== 'camera') {
      inputValidatedObject = validateInput(currentMessage, answerInputModified, source, this.state.result);
    } else {
      console.log(currentMessage, answerInputModified, fileName, fileExtension);
      inputValidatedObject = validateFile(currentMessage, answerInputModified, fileName, fileExtension);
    }

    console.log('inputValidatedObject :- ', inputValidatedObject);

    if (inputValidatedObject.success) {
      if (currentMessage.widget !== 'file' && currentMessage.widget !== 'camera') {
        repliedMessages.push({
          source,
          text: answerInput,
          sender: 'user',
          showTime: true
        });
      } else {
        repliedMessages.push({
          source,
          fileURL: answerInput,
          fileName,
          fileExtension,
          sender: 'user',
          showTime: true
        });
      }

      this.setState({
        repliedMessages,
        isUserTyping: false,
        inputError: false
      }, () => {
        this.handleNextMessage();
      });

    } else {
      if (inputValidatedObject.foundError) {
        if (currentMessage.widget !== 'file' && currentMessage.widget !== 'camera') {
          repliedMessages.push({
            source,
            text: answerInput,
            sender: 'user',
            showTime: true,
            isError: true,
          });
        } else {
          repliedMessages.push({
            source: source,
            fileURL: answerInput,
            fileName,
            fileExtension,
            sender: 'user',
            showTime: true
          });
        }
        
        repliedMessages.push({
          source: 'text',
          text: inputValidatedObject.errorMessage,
          sender: 'bot',
          errorMessage: true
        });
        if (currentMessage.widget === 'radio' || currentMessage.widget === 'checkbox') {
          this.setState({ repliedMessages }, () => this.handleNextMessage());
        } else {
          this.setState({ repliedMessages });
        }
      }
      return;
    }
  }

  render() {
    const {
      uiData
    } = this.state;

    console.log('repliedMessages :- ', this.state.repliedMessages);

    const [ currentMessage = {} ] = this.state.messages.slice(-1);

    return (
      <View style={styles.flexView}>
        {
          this.state.openCameraView
          ?
            <View style={styles.flexView}>
              {
                currentMessage.widget === 'qrscanner'
                ?
                  null
                :
                  <View style={styles.flexView}>
                    {
                      currentMessage.widget === 'camera'
                      ?
                        <Camera
                          handleStateValue={this.handleStateValue}
                          onCapture={this.submitInputValue} />
                      :
                        null
                    }
                  </View>
              }
            </View>
          :
            <View style={styles.flexView}>
              <Header
                title={uiData.header.title}
                subtitle={uiData.header.subtitle}
                icon={uiData.header.icon}
                subtitleIcon={uiData.header.subtitleIcon}
              />
              <KeyboardAvoidingView style={styles.flexView} behavior='padding' keyboardVerticalOffset={-500}>
                <Body
                  result={this.state.result}
                  loader={uiData.loader}
                  submitInputValue={this.submitInputValue}
                  repliedMessages={this.state.repliedMessages}
                  isUserTyping={this.state.isUserTyping}
                  isBotTyping={this.state.isBotTyping}
                  currentMessage={currentMessage}
                  handleNextMessage={this.handleNextMessage}
                  handleStateValue={this.handleStateValue}
                  noMessageAvailable={this.state.messages && this.state.messages.length === 0}
                />
                {
                  this.state.isUserAllowedToAnswer
                  ?
                    <Footer
                      icon={uiData.footer.icon}
                      submitInputValue={this.submitInputValue}
                      isBotTyping={this.state.isBotTyping}
                      handleStateValue={this.handleStateValue}
                      isUserAllowedToAnswer={this.state.isUserAllowedToAnswer}
                      currentMessage={currentMessage}
                    />
                  :
                    null
                }
              </KeyboardAvoidingView>
            </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flexView: {
    flex: 1,
  },
});
