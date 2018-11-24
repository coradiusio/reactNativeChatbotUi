import React from 'react';
import {
  StyleSheet,
  View,
  KeyboardAvoidingView
} from 'react-native';

import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';

import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';

import Camera from './components/sub_components/Camera';

import {
  colors
} from './general';

import {
  validateInput,
  stringCasing,
  validateFile,
} from './utils';

let timer;
let questions = [];

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
      currentQuestionIndex: 0,
      messages: [],
      isBotTyping: false,
      isUserTyping: false,
      isUserAllowedToAnswer: false,
      openCameraView: false,
      mode: 'question'
    };

    // setup socket connection
    this.app = feathers()
      .configure(socketio(io(this.props.host || 'http://192.168.42.170:7664', 
        {
          transports: ['websocket'],
        }
      )));

    this.messagesService = this.app.service('messages');
    this.questionsService = this.app.service('questions');

    this.submitInputValue = this.submitInputValue.bind(this);
    this.handleNextQuestion = this.handleNextQuestion.bind(this);
    this.handleStateValue = this.handleStateValue.bind(this);
  }

  componentDidMount() {
    this.fetchMessagesHistory();

    this.messagesService.on('created', message => {
      console.log('new message created :- ', message);
      this.setState(prevState => ({
        messages: [ ...prevState.messages, message ]
      }));
    });
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
        if (response.data.length > 0) {
          // this.setState({
          //   messages: response.data
          // });
        }
        if (this.state.mode.trim().toLowerCase() === 'question') {
          this.fetchNextQuestion();
        }
      })
      .catch(err => {
        console.log('err in fetching messages history :- ', err);
      });
  }

  handleStateValue(state, value) {
    this.setState({ [state]: value });
  }

  getLastQuestionNode() {
    return null;
  }

  fetchNextQuestion() {
    this.questionsService.find(
      { 
        query: {
          $limit: 1,
        }
      }
    )
      .then(response => {
        console.log('next question :- ', response.data);
        if (response.data.length > 0) {
          questions.push(response.data[0])
          this.handleNextQuestion();
        }
      })
      .catch(err => {
        console.log('err in fetching next question :- ', err);
      });
  }

  sendNewMessage(message) {
    return this.messagesService.create(message);
  }

  handleNextQuestion() {
    this.setState({ isBotTyping: true, isUserAllowedToAnswer: false }, () => {
      timer = setTimeout(() => {
        const [ currentQuestion ] = questions.slice(-1);

        if (currentQuestion) {
          const {
            question 
          } = currentQuestion;

          const questionArray = question instanceof Array ? question : (typeof question === 'string' ? [question] : null);

          const { currentQuestionIndex } = this.state;

          if (questionArray) {
            let newMessages = [];
            if (currentQuestionIndex === questionArray.length - 1) {
              newMessages.push({
                text: questionArray[currentQuestionIndex],
                sender: 'bot',
                showTime: true
              });

              if (currentQuestion.widget === 'radio' && currentQuestion.radioOptions) {
                newMessages.push({
                  widget: 'radio',
                  radioOptions: currentQuestion.radioOptions,
                  node: currentQuestion.node,
                  isAnswer: true,
                  sender: 'bot'
                });
              } else if (currentQuestion.widget === 'checkbox' && currentQuestion.checkboxOptions) {
                newMessages.push({
                  widget: 'checkbox',
                  checkboxOptions: currentQuestion.checkboxOptions,
                  joinWith: currentQuestion.validateInput.joinWith || ',',
                  node: currentQuestion.node,
                  isAnswer: true,
                  sender: 'bot'
                });
              }

              this.setState({
                currentQuestionIndex: 0,
                isBotTyping: false,
              }, () => {
                this.sendNewMessage(newMessages)
                  .then(() => {
                    this.setState({
                      isUserAllowedToAnswer: true,
                    });
                  })
                  .catch(err => {
                    console.log('msg not sent :- ', err);
                  });
              });
                
            } else {
              newMessages.push({
                text: questionArray[currentQuestionIndex],
                sender: 'bot'
              });

              this.sendNewMessage(newMessages)
                .then(() => {
                  this.setState({
                    isBotTyping: false,
                    currentQuestionIndex: currentQuestionIndex + 1
                  }, () => {
                    this.handleNextQuestion()
                  });
                })
                .catch(err => {
                  console.log('msg not sent :- ', err);
                });
            }
          }
        }
      }, 500);
    });
  }

  submitInputValue(currentQuestion, answerInput, formValue = '', source = 'text', fileName = '', fileExtension = '') {
    // first replace all spaces by single for safety
    answerInput = answerInput.replace(/\s\s+/g, ' ').trim();

    if (currentQuestion.validateInput && currentQuestion.validateInput.casing) {
      answerInput = stringCasing(answerInput, currentQuestion.validateInput.casing.trim().toLowerCase());
    }

    const { messages } = this.state;

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
      inputValidatedObject = validateInput(currentQuestion, answerInputModified, source, this.state.result);
    } else {
      console.log(currentQuestion, answerInputModified, fileName, fileExtension);
      inputValidatedObject = validateFile(currentQuestion, answerInputModified, fileName, fileExtension);
    }

    console.log('inputValidatedObject :- ', inputValidatedObject);

    if (inputValidatedObject.success) {
      let newMessages = [];
      if (currentQuestion.widget !== 'file' && currentQuestion.widget !== 'camera') {
        newMessages.push({
          source,
          text: answerInput,
          sender: 'user',
          showTime: true
        });
      } else {
        newMessages.push({
          source,
          fileURL: answerInput,
          fileName,
          fileExtension,
          sender: 'user',
          showTime: true
        });
      }

      this.sendNewMessage(newMessages)
        .then(() => {
          this.setState({
            isUserTyping: false,
            inputError: false
          }, () => {
            this.fetchNextQuestion();
          });
        })
        .catch(err => {
          console.log('usr msg not sent :- ', err);
        });
    } else {
      if (inputValidatedObject.foundError) {
        if (currentQuestion.widget !== 'file' && currentQuestion.widget !== 'camera') {
          messages.push({
            source,
            text: answerInput,
            sender: 'user',
            showTime: true,
            isError: true,
          });
        } else {
          messages.push({
            source: source,
            fileURL: answerInput,
            fileName,
            fileExtension,
            sender: 'user',
            showTime: true
          });
        }
        
        messages.push({
          source: 'text',
          text: inputValidatedObject.errorMessage,
          sender: 'bot',
          errorMessage: true
        });
        this.setState({ messages });
      }
      return;
    }
  }

  render() {
    const {
      uiData
    } = this.state;

    const [ currentQuestion = {} ] = questions.slice(-1);

    return (
      <View style={styles.flexView}>
        {
          this.state.openCameraView
          ?
            <View style={styles.flexView}>
              {
                currentQuestion.widget === 'qrscanner'
                ?
                  null
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
                  loader={uiData.loader}
                  submitInputValue={this.submitInputValue}
                  messages={this.state.messages}
                  isUserTyping={this.state.isUserTyping}
                  isBotTyping={this.state.isBotTyping}
                  currentQuestion={currentQuestion}
                  handleNextQuestion={this.handleNextQuestion}
                  handleStateValue={this.handleStateValue}
                  noMessageAvailable={questions && questions.length === 0}
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
                      currentQuestion={currentQuestion}
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
