import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView
} from 'react-native';

import axios from 'axios';

import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';

import {
  QRCodeScan
} from 'reactNativeBasicComponents';

import Camera from './components/sub_components/Camera';

import {
  massageText,
  formatAMPM,
  validateInput,
  setValue,
  getValue,
  stringCases,
  stringCasing,
  validateFile
} from './utils';

const config = { timeout: 300000 };
let timer;

export default class FormBotApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.logicalData || {
      result: {},
      currentNode: 0,
      currentQuestionIndex: 0,
      questions: [],
      repliedMessages: [],
      isBotTyping: false,
      isUserTyping: false,
      isUserAllowedToAnswer: false,
      openCameraView: false
    };
    this.submitInputValue = this.submitInputValue.bind(this);
    this.askNextQuestion = this.askNextQuestion.bind(this);
    this.handleStateValue = this.handleStateValue.bind(this);
    this.modifyResult = this.modifyResult.bind(this);
    this.handleServerResponse = this.handleServerResponse.bind(this);
  }

  componentDidMount() {
    this.askNextQuestion();
  }

  componentWillUnmount() {
    clearTimeout(timer);
  }

  handleStateValue(state, value) {
    this.setState({ [state]: value });
  }

  askConditionsCheck(currentQuestion) {
    let success = false,
    entityValue = '',
    entityPath = '';

    for(let i = 0; i < currentQuestion.askConditions.length; i++) {
      // now first get entity value from propertyPath
      entityValue = '';
      entityPath = currentQuestion.askConditions[i].entityPath;
      entityValue = getValue(
        `${entityPath && entityPath !== '' ? `${entityPath}.` :''}${currentQuestion.askConditions[i].entity}`, this.state.result
      );
      if (entityValue === currentQuestion.askConditions[i].value) {
        success = true;
      } else {
        success = false;
        break;
      }
    }
    return success;
  }

  skipConditionsCheck(currentQuestion) {
    let success = false,
    entityValue = '',
    entityPath = '';

    for(let i = 0; i < currentQuestion.skipConditions.length; i++) {
      // now first get entity value from propertyPath
      entityValue = '';
      entityPath = currentQuestion.skipConditions[i].entityPath;
      entityValue = getValue(
        `${entityPath && entityPath !== '' ? `${entityPath}.` :''}${currentQuestion.skipConditions[i].entity}`, this.state.result
      );
      if (entityValue === currentQuestion.skipConditions[i].value) {
        success = true;
        break;
      } else {
        success = false;
      }
    }
    return success;
  }

  askNextQuestion() {
    console.log('currentNode :- ', this.state.currentNode);
    this.setState({ isBotTyping: true, isUserAllowedToAnswer: false }, () => {
      timer = setTimeout(() => {
        const currentQuestion = this.state.questions.find(question => question.node === this.state.currentNode + 1);
        if (currentQuestion) {
          let toProceedAhead = true;
          if (currentQuestion.skipConditions) {
            if (this.skipConditionsCheck(currentQuestion)) {
              let incrementCounter = 1;
              let nextQuestion;
              nextQuestion = this.state.questions.find(question => question.node === this.state.currentNode + incrementCounter);
              while (nextQuestion && typeof nextQuestion === 'object' && 'skipConditions' in nextQuestion) {
                if (nextQuestion.skipConditions && this.skipConditionsCheck(nextQuestion)) {
                  incrementCounter += 1;
                  nextQuestion = this.state.questions.find(question => question.node === this.state.currentNode + incrementCounter);
                } else {
                  break;
                }
              }

              toProceedAhead = false;
              this.setState({
                currentNode: this.state.currentNode + incrementCounter - 1,
                currentQuestionIndex: 0,
              }, () => {
                this.askNextQuestion()
              });
            }
          }
          
          if (currentQuestion.askConditions) {
            if (!this.askConditionsCheck(currentQuestion)) {
              let incrementCounter = 1;
              let nextQuestion;
              nextQuestion = this.state.questions.find(question => question.node === this.state.currentNode + incrementCounter);
              while (nextQuestion && typeof nextQuestion === 'object' && 'askConditions' in nextQuestion) {
                if (nextQuestion.askConditions && !this.askConditionsCheck(nextQuestion)) {
                  incrementCounter += 1;
                  nextQuestion = this.state.questions.find(question => question.node === this.state.currentNode + incrementCounter);
                } else {
                  break;
                }
              }

              toProceedAhead = false;
              this.setState({
                currentNode: this.state.currentNode + incrementCounter - 1,
                currentQuestionIndex: 0,
              }, () => {
                this.askNextQuestion()
              });
            }
          }

          if (toProceedAhead) {
            const question = currentQuestion.question;

            const { repliedMessages, currentQuestionIndex } = this.state;

            if (question instanceof Array) {
              if (currentQuestionIndex === question.length - 1) {
                repliedMessages.push({
                  text: question[currentQuestionIndex],
                  sender: 'bot',
                  createdAt: formatAMPM(new Date()),
                  showTime: true
                });

                if (currentQuestion.widget === 'radio' && currentQuestion.radioOptions) {
                  repliedMessages.push({
                    widget: 'radio',
                    radioOptions: currentQuestion.radioOptions,
                    node: currentQuestion.node,
                    isAnswer: true,
                    sender: 'bot'
                  });
                } else if (currentQuestion.widget === 'checkbox' && currentQuestion.checkboxOptions) {
                  repliedMessages.push({
                    widget: 'checkbox',
                    checkboxOptions: currentQuestion.checkboxOptions,
                    joinWith: currentQuestion.validateInput.joinWith || ',',
                    node: currentQuestion.node,
                    isAnswer: true,
                    sender: 'bot'
                  });
                }

                this.setState({
                  currentNode: this.state.currentNode + 1,
                  currentQuestionIndex: 0,
                  repliedMessages,
                  isBotTyping: false,
                  isUserAllowedToAnswer: true,
                }, () => {
                  if (currentQuestion.redirectURL) {
                    setTimeout(() => {
                      window.location = currentQuestion.redirectURL;
                    }, currentQuestion.redirectDelay || 1000);
                  }
                });
              } else {
                repliedMessages.push({
                  text: question[currentQuestionIndex],
                  sender: 'bot'
                });

                this.setState({
                  repliedMessages,
                  currentQuestionIndex: currentQuestionIndex + 1
                }, () => {
                  this.askNextQuestion()
                });
              }
            } else if (typeof question === 'string') {
              repliedMessages.push({
                text: question,
                sender: 'bot',
                createdAt: formatAMPM(new Date()),
                showTime: true
              });

              if (currentQuestion.widget === 'radio' && currentQuestion.radioOptions) {
                repliedMessages.push({
                  text: <div>{this.answerChoices('radio', currentQuestion.radioOptions)}</div>,
                  sender: 'bot'
                });
              } else if (currentQuestion.widget === 'checkbox' && currentQuestion.checkboxOptions) {
                repliedMessages.push({
                  widget: 'checkbox',
                  checkboxOptions: currentQuestion.checkboxOptions,
                  joinWith: currentQuestion.validateInput.joinWith || ',',
                  node: currentQuestion.node,
                  isAnswer: true,
                  sender: 'bot'
                });
              }

              this.setState({
                currentNode: this.state.currentNode + 1,
                repliedMessages,
                isBotTyping: false,
                isUserAllowedToAnswer: true,
              });
            }

            if (currentQuestion.serverImplementation) {
              const request = currentQuestion.serverImplementation.request;
              const response = currentQuestion.serverImplementation.response;
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

                  axios.get(absoluteURL, config)
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
                    config.headers = requestType.headers;
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

                  axios.post(absoluteURL, data, config)
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
          }
        }
      }, 1000);
    });
  }

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
        this.setState({ result, repliedMessages, currentNode: this.state.currentNode + 1 }, () => {
          this.askNextQuestion();
        });
      }
      else if (successShowMessage) {
        repliedMessages.push({
          source: 'text',
          text: successShowMessage,
          sender: 'bot',
        });
        this.setState({ result, repliedMessages, currentNode: this.state.currentNode + 1 }, () => {
          this.askNextQuestion();
        });
      } else {
        this.setState({ result, currentNode: this.state.currentNode + 1 }, () => {
          this.askNextQuestion();
        });
      }
    }
  }

  modifyResult(currentQuestion, answerInputModified) {
    const questionEntity = currentQuestion.entity;
    const questionPath = currentQuestion.entityPath;

    if (questionEntity) {
      const { result } = this.state;
      const validateInput = currentQuestion.validateInput;
      const outputType = validateInput && validateInput.outputType;
      if (outputType === 'string' || outputType === 'number') {
        setValue(`${questionPath === undefined || questionPath === '' ? '' : '.'}${questionEntity}`, answerInputModified, result);
        this.setState({ result });
      } else if (outputType === 'array') {
        answerInputModified = answerInputModified.split(currentQuestion.validateInput.joinWith || ',');
        setValue(`${questionPath === undefined || questionPath === '' ? '' : '.'}${questionEntity}`, answerInputModified, result);
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
              setValue(`${questionPath === undefined || questionPath === '' ? '' : '.'}${questionEntity}.${keys[i].keyName}`, answerInputModified[keyValueIndex], result);
            } else if (keyValueIndexType === 'object') {
              const orConditions = keys[i].keyValueIndex.or;
              const andConditions = keys[i].keyValueIndex.and;

              // first follow OR then AND
              if (orConditions instanceof Array) {
                for (let j = 0; j < orConditions.length; j++) {
                  if (orConditions[j].inputLength === answerInputModifiedLength) {
                    setValue(`${questionPath === undefined || questionPath === '' ? '' : '.'}${questionEntity}.${keys[i].keyName}`, answerInputModified[orConditions[j].keyValueIndex], result);
                    break;
                  }
                } 
              }

              if (andConditions instanceof Array) {
                for (let k = 0; k < andConditions.length; k++) {
                  if (andConditions[k].inputLength === answerInputModifiedLength) {
                    setValue(`${questionPath === undefined || questionPath === '' ? '' : '.'}${questionEntity}.${keys[i].keyName}`, answerInputModified[andConditions[k].keyValueIndex], result);
                  }
                }
              }
            }

            if (keys[i].casing && stringCases.indexOf(keys[i].casing.trim().toLowerCase() > -1)) {
              const path = `${questionPath === undefined || questionPath === '' ? '' : '.'}${questionEntity}.${keys[i].keyName}`;
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

  submitInputValue(answerInput, formValue = '', source = 'text', fileName = '', fileExtension = '') {
    // first replace all spaces by single for safety
    answerInput = answerInput.replace(/\s\s+/g, ' ').trim();

    const currentQuestion = this.state.questions.find(question => question.node === this.state.currentNode);

    if (currentQuestion.validateInput && currentQuestion.validateInput.casing) {
      answerInput = stringCasing(answerInput, currentQuestion.validateInput.casing.trim().toLowerCase());
    }

    const { repliedMessages } = this.state;

    let answerInputModified;
    if (formValue !== '') {
      answerInputModified = formValue.replace(/\s\s+/g, ' ').trim();
    } else {
      answerInputModified = answerInput.replace(/\s\s+/g, ' ').trim();
    }

    if (source === 'camera') {
      fileName = answerInput.split('/').slice(-1);
      fileExtension = fileName[0].split('.').slice(-1);
    }

    let inputValidatedObject;
    if (source !== 'file' && source !== 'camera') {
      inputValidatedObject = validateInput(currentQuestion, answerInputModified, source, this.state.result);
    } else {
      inputValidatedObject = validateFile(currentQuestion, answerInputModified, fileName, fileExtension);
    }

    console.log('inputValidatedObject :- ', inputValidatedObject);

    if (inputValidatedObject.success) {
      if (currentQuestion.widget !== 'file' && currentQuestion.widget !== 'camera') {
        repliedMessages.push({
          source,
          text: answerInput,
          sender: 'user',
          createdAt: formatAMPM(new Date()),
          showTime: true // here setting it as true bcz user can only enter one message for a question , so need to show time for each user reply
        });
      } else {
        repliedMessages.push({
          source,
          fileURL: answerInput,
          fileName,
          fileExtension,
          sender: 'user',
          createdAt: formatAMPM(new Date()),
          showTime: true // here setting it as true bcz user can only enter one message for a question , so need to show time for each user reply
        });
      }

      this.modifyResult(currentQuestion, inputValidatedObject.answerInputModified);

      this.setState({
        repliedMessages,
        isUserTyping: false,
        inputError: false
      }, () => {
        this.askNextQuestion();
      });

    } else {
      if (inputValidatedObject.foundError) {
        if (currentQuestion.widget !== 'file' && currentQuestion.widget !== 'camera') {
          repliedMessages.push({
            source,
            text: answerInput,
            sender: 'user',
            createdAt: formatAMPM(new Date()),
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
            createdAt: formatAMPM(new Date()),
            showTime: true // here setting it as true bcz user can only enter one message for a question , so need to show time for each user reply
          });
        }
        
        repliedMessages.push({
          source: 'text',
          text: inputValidatedObject.errorMessage,
          sender: 'bot',
          errorMessage: true
        });
        if (currentQuestion.widget === 'radio' || currentQuestion.widget === 'checkbox') {
          this.setState({ currentNode: this.state.currentNode - 1, repliedMessages }, () => this.askNextQuestion());
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
    } = this.props;

    const currentQuestion = this.state.currentNode === 0
      ? {}
      : this.state.questions.find(question => question.node === this.state.currentNode);

    return (
      <View style={styles.flexView}>
        {
          this.state.openCameraView
          ?
            <View style={styles.flexView}>
              {
                currentQuestion.widget === 'qrscanner'
                ?
                  <QRCodeScan
                    onScanSuccess={(data) => {
                      this.handleStateValue('openCameraView', false);
                      this.submitInputValue(data);
                    }}
                  />
                :
                  <View style={styles.flexView}>
                    {
                      currentQuestion.widget === 'camera'
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
                  submitInputValue={this.submitInputValue}
                  repliedMessages={this.state.repliedMessages}
                  isUserTyping={this.state.isUserTyping}
                  isBotTyping={this.state.isBotTyping}
                  currentQuestion={currentQuestion}
                  askNextQuestion={this.askNextQuestion}
                  handleStateValue={this.handleStateValue}
                  noQuestionAvailable={this.state.questions && this.state.questions.length === 0}
                />
                <Footer
                  icon={uiData.footer.icon}
                  submitInputValue={this.submitInputValue}
                  isBotTyping={this.state.isBotTyping}
                  handleStateValue={this.handleStateValue}
                  isUserAllowedToAnswer={this.state.isUserAllowedToAnswer}
                  currentQuestion={currentQuestion}
                />
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
