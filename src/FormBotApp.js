import React from 'react'
import {
  StyleSheet,
  View,
  KeyboardAvoidingView
} from 'react-native'

import io from 'socket.io-client'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'

import Header from './components/Header'
import Body from './components/Body'
import Footer from './components/Footer'

import Camera from './components/sub_components/Camera'

import {
  colors
} from './general'

import {
  validateInput,
  stringCasing,
  validateFile
} from './utils'

const uuidv4 = require('uuid/v4')

let timer
let questions = []

const botRole = {
  type: 'bot',
  displayName: 'Bot'
}

export default class FormBotApp extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      uiData: {
        header: {
          title: 'Chatbot Assistant',
          subtitle: 'online',
          icon: {
            name: 'robot',
            type: 'material-community',
            color: colors.headerIconColor,
            size: 40
          },
          subtitleIcon: {
            name: 'circle',
            type: 'material-community',
            color: colors.onlineIconColor,
            size: 12
          }
        },
        loader: {
          color: colors.primary
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
      isUserAllowedToAnswer: false,
      openCameraView: false,
      botMode: 'question',
      role: this.props.role || {
        type: 'user',
        displayName: 'Robin'
      },
      isReceiverTyping: false
    }

    // setup socket connection
    this.app = feathers()
      .configure(socketio(io(this.props.host || 'http://192.168.42.63:7664',
        {
          transports: ['websocket'],
          forceNew: true
        }
      )))

    this.messagesService = this.app.service('messages')
    this.questionsService = this.app.service('questions')

    this.submitInputValue = this.submitInputValue.bind(this)
    this.handleNextQuestion = this.handleNextQuestion.bind(this)
    this.handleStateValue = this.handleStateValue.bind(this)
    this.handleSenderTyping = this.handleSenderTyping.bind(this)
  }

  componentDidMount () {
    this.fetchMessagesHistory()

    this.messagesService.on('created', message => {
      console.log('new message created :- ', message)
      this.handleCreatedMessage(message)
    })

    this.messagesService.on('updated', message => {
      console.log('message updated :- ', message)
      this.handleUpdatedMessage(message)
    })

    this.messagesService.on('patched', message => {
      console.log('message patched :- ', message)
      this.handleUpdatedMessage(message)
    })

    this.messagesService.on('removed', message => {
      console.log('message removed :- ', message)
      this.handleRemovedMessage(message)
    })
  }

  handleCreatedMessage (message) {
    this.setState(prevState => {
      return ({
        messages: [ ...prevState.messages, message ]
      })
    })
  }

  handleUpdatedMessage (message) {
    this.setState(prevState => {
      return ({
        messages: [ ...prevState.messages.filter(item => item.message_id !== message.message_id), message ]
      })
    })
  }

  handleRemovedMessage (message) {
    this.setState(prevState => {
      return ({
        messages: [ ...prevState.messages.filter(item => item.message_id !== message.message_id) ]
      })
    })
  }

  handleSenderTyping (value) {
    // do something here
  }

  componentWillUnmount () {
    if (timer) {
      clearTimeout(timer)
    }

    this.app = null
  }

  fetchMessagesHistory (message_id = null) {
    this.messagesService.find({ message_id })
      .then(response => {
        if (response.data.length > 0) {
          this.setState({
            messages: response.data
          })
        }
        if (this.state.botMode.trim().toLowerCase() === 'question') {
          this.fetchNextQuestion()
        }
      })
      .catch(err => {
        console.log('err in fetching messages history :- ', err)
      })
  }

  handleStateValue (state, value) {
    this.setState({ [state]: value })
  }

  fetchNextQuestion () {
    this.questionsService.find(
      {
        query: {
          $limit: 1
        }
      }
    )
      .then(response => {
        console.log('next question :- ', response.data)
        if (response.data.length > 0) {
          questions.push(response.data[0])
          this.handleNextQuestion()
        }
      })
      .catch(err => {
        console.log('err in fetching next question :- ', err)
      })
  }

  sendNewMessage (message) {
    return this.messagesService.create(message)
  }

  handleNextQuestion () {
    this.setState({
      isUserAllowedToAnswer: false,
      isReceiverTyping: true
    }, () => {
      timer = setTimeout(() => {
        const [ currentQuestion ] = questions.slice(-1)

        if (currentQuestion) {
          const {
            question
          } = currentQuestion

          const time = new Date()
          console.log('time :- ', time)

          delete currentQuestion._id
          currentQuestion.message_id = uuidv4()

          currentQuestion.sender = botRole

          const questionArray = question instanceof Array ? question : (typeof question === 'string' ? [question] : [])

          const { currentQuestionIndex } = this.state

          if (questionArray.length > 0) {
            let lastMessages = []
            if (currentQuestionIndex === questionArray.length - 1) {
              lastMessages.push({
                message: {
                  text: questionArray[currentQuestionIndex]
                },
                createdAt: time,
                sender: botRole,
                showTime: true,
                message_id: uuidv4()
              })

              if (currentQuestion.input.widget.type === 'radio' && currentQuestion.input.widget.options) {
                lastMessages.push({
                  message: {
                    quick_replies: currentQuestion.input.widget.options
                  },
                  widget: currentQuestion.input.widget.type,
                  createdAt: time,
                  state: currentQuestion.state,
                  sender: botRole,
                  isAnswerOptions: true,
                  showTime: true,
                  message_id: uuidv4()
                })
              } else if (currentQuestion.input.widget.type === 'checkbox' && currentQuestion.input.widget.options) {
                lastMessages.push({
                  message: {
                    quick_replies: currentQuestion.input.widget.options
                  },
                  widget: currentQuestion.input.widget.type,
                  createdAt: time,
                  joinWith: currentQuestion.validateInput.joinWith || ',',
                  state: currentQuestion.state,
                  sender: botRole,
                  isAnswerOptions: true,
                  showTime: true,
                  message_id: uuidv4()
                })
              }

              this.sendNewMessage(lastMessages)
                .then(() => {
                  this.setState({
                    currentQuestionIndex: 0,
                    isReceiverTyping: false,
                    isUserAllowedToAnswer: true
                  })
                }).catch(err => {
                  console.log('err :- ', err)
                })
            } else {
              this.sendNewMessage({
                message: {
                  text: questionArray[currentQuestionIndex],
                },
                createdAt: time,
                sender: botRole,
                message_id: uuidv4()
              }).then(() => {
                this.setState({
                  isReceiverTyping: false,
                  currentQuestionIndex: currentQuestionIndex + 1
                }, () => {
                  this.handleNextQuestion()
                })
              }).catch(err => {
                console.log('err :- ', err)
              })
            }
          }
        }
      }, 500)
    })
  }

  submitInputValue (currentQuestion, answerInput, formValue = '', source = 'text', fileName = '', fileExtension = '') {
    // first replace all spaces by single for safety
    answerInput = answerInput.replace(/\s\s+/g, ' ').trim()

    if (currentQuestion.validateInput && currentQuestion.validateInput.casing) {
      answerInput = stringCasing(answerInput, currentQuestion.validateInput.casing.trim().toLowerCase())
    }

    const today = new Date()

    let answerInputModified
    if (formValue !== '') {
      answerInputModified = formValue.replace(/\s\s+/g, ' ').trim()
    } else {
      answerInputModified = answerInput.replace(/\s\s+/g, ' ').trim()
    }

    let fullFileName = ''
    if (source === 'camera') {
      fullFileName = answerInput.split('/').slice(-1)[0]
      fileName = fullFileName.split('.')[0]
      fileExtension = fullFileName.split('.')[1]
    }

    console.log('fileName :-', fileName)
    console.log('fileExtension :-', fileExtension)

    let inputValidatedObject
    if (source !== 'file' && source !== 'camera') {
      inputValidatedObject = validateInput(currentQuestion, answerInputModified, source, this.state.result)
    } else {
      console.log(currentQuestion, answerInputModified, fileName, fileExtension)
      inputValidatedObject = validateFile(currentQuestion, answerInputModified, fileName, fileExtension)
    }

    console.log('inputValidatedObject :- ', inputValidatedObject)

    if (inputValidatedObject.success) {
      let newMessage
      if (currentQuestion.widget !== 'file' && currentQuestion.widget !== 'camera') {
        newMessage = {
          source,
          message: {
            text: answerInput
          },
          createdAt: today,
          sender: this.state.role,
          showTime: true,
          uid: uuidv4()
        }
      } else {
        newMessage = {
          source,
          fileURL: answerInput,
          fileName,
          fileExtension,
          answerOfNode: currentQuestion.node,
          createdAt: today,
          sender: this.state.role,
          showTime: true,
          uid: uuidv4()
        }
      }

      this.sendNewMessage(newMessage)
        .then(() => {
          // here we need to fetch answer validation if any thing wrong bcz of additional validation , if success then call fetchNextQuestion
          this.fetchNextQuestion()
        })
        .catch(err => {
          console.log('usr msg not sent :- ', err)
        })
    } else {
      if (inputValidatedObject.foundError) {
        let newMessages = []
        if (currentQuestion.widget !== 'file' && currentQuestion.widget !== 'camera') {
          newMessages.push({
            source,
            message: {
              text: answerInput
            },
            showTime: true,
            sender: this.state.role
          })
        } else {
          newMessages.push({
            source: source,
            fileURL: answerInput,
            fileName,
            fileExtension,
            showTime: true,
            sender: this.state.role
          })
        }

        newMessages.push({
          source: 'text',
          message: {
            text: inputValidatedObject.errorMessage
          },
          sender: botRole,
          isError: true
        })

        this.sendNewMessage(newMessages)
      }
    }
  }

  render () {
    const {
      uiData
    } = this.state

    console.log('messages :- ', this.state.messages)

    const [ currentQuestion = {} ] = questions.slice(-1)

    return (
      <View style={styles.flexView}>
        {
          this.state.openCameraView
            ? <View style={styles.flexView}>
              {
                currentQuestion.widget === 'qrscanner'
                  ? null
                  : <View style={styles.flexView}>
                    {
                      currentQuestion.widget === 'camera'
                        ? <Camera
                          handleStateValue={this.handleStateValue}
                          onCapture={this.submitInputValue}
                        />
                        : null
                    }
                  </View>
              }
            </View>
            : <View style={styles.flexView}>
              <Header
                title={uiData.header.title}
                subtitle={uiData.header.subtitle}
                icon={uiData.header.icon}
                subtitleIcon={uiData.header.subtitleIcon}
                isReceiverTyping={this.state.isReceiverTyping}
              />
              <KeyboardAvoidingView style={styles.flexView} behavior='padding' keyboardVerticalOffset={-500}>
                <Body
                  result={this.state.result}
                  loader={uiData.loader}
                  submitInputValue={this.submitInputValue}
                  messages={this.state.messages}
                  currentQuestion={currentQuestion}
                  handleNextQuestion={this.handleNextQuestion}
                  handleStateValue={this.handleStateValue}
                  noMessageAvailable={questions && questions.length === 0}
                  role={this.state.role}
                  botMode={this.state.botMode}
                />
                <Footer
                  icon={uiData.footer.icon}
                  submitInputValue={this.submitInputValue}
                  handleStateValue={this.handleStateValue}
                  isUserAllowedToAnswer={this.state.isUserAllowedToAnswer}
                  currentQuestion={currentQuestion}
                  handleSenderTyping={this.handleSenderTyping}
                />
              </KeyboardAvoidingView>
            </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flexView: {
    flex: 1
  }
})
