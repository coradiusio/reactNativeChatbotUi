import React from 'react'
import {
  StyleSheet,
  View,
  KeyboardAvoidingView
} from 'react-native'

import io from 'socket.io-client'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'

import dayjs from 'dayjs'

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
      }
    }

    // setup socket connection
    this.app = feathers()
      .configure(socketio(io(this.props.host || 'http://192.168.42.63:7664',
        {
          transports: ['websocket']
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
      // here need to improve in removing typing component logic whether it was sender or receiver
      this.setState(prevState => {
        return ({
          messages: [ ...prevState.messages.filter(item => ((!item.isSenderTyping) && (!item.isReceiverTyping))), message ]
        })
      })
    })
  }

  componentWillUnmount () {
    if (timer) {
      clearTimeout(timer)
    }

    this.app = null
  }

  fetchMessagesHistory () {
    this.messagesService.find()
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

  handleSenderTyping (value) {
    const isTyping = this.state.messages[this.state.messages.length - 1].isSenderTyping

    if (value) {
      if (!isTyping) {
        this.setState(prevState => ({
          messages: [...prevState.messages, { creator: this.state.role, isSenderTyping: true }]
        }))
      }
    } else {
      console.log('handleSenderTyping else called')
      this.setState(prevState => ({
        messages: prevState.messages.filter(item => !item.isSenderTyping)
      }))
    }
  }

  getLastQuestionNode () {
    return null
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
    this.setState(prevState => ({
      messages: [...prevState.messages, { creator: botRole, isReceiverTyping: true }],
      isUserAllowedToAnswer: false
    }), () => {
      timer = setTimeout(() => {
        const [ currentQuestion ] = questions.slice(-1)

        if (currentQuestion) {
          const {
            question
          } = currentQuestion

          const time = new Date()
          console.log('time :- ', time)

          const questionArray = question instanceof Array ? question : (typeof question === 'string' ? [question] : [])

          const { currentQuestionIndex } = this.state

          if (questionArray.length > 0) {
            let newMessages = []
            if (currentQuestionIndex === questionArray.length - 1) {
              newMessages.push({
                text: questionArray[currentQuestionIndex],
                node: currentQuestion.node,
                createdAt: time,
                creator: botRole,
                showTime: true,
                uid: uuidv4()
              })

              if (currentQuestion.widget.type === 'radio' && currentQuestion.widget.options) {
                newMessages.push({
                  widget: currentQuestion.widget,
                  node: currentQuestion.node,
                  state: currentQuestion.state,
                  isAnswerOptions: true,
                  createdAt: time,
                  creator: botRole,
                  uid: uuidv4()
                })
              } else if (currentQuestion.widget.type === 'checkbox' && currentQuestion.widget.options) {
                newMessages.push({
                  widget: currentQuestion.widget,
                  joinWith: currentQuestion.validateInput.joinWith || ',',
                  node: currentQuestion.node,
                  state: currentQuestion.state,
                  isAnswerOptions: true,
                  createdAt: time,
                  creator: botRole,
                  uid: uuidv4()
                })
              }

              this.sendNewMessage(newMessages)
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
                text: questionArray[currentQuestionIndex],
                node: currentQuestion.node,
                createdAt: time,
                creator: botRole,
                uid: uuidv4()
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
          text: answerInput,
          answerOfNode: currentQuestion.node,
          createdAt: today,
          creator: this.state.role,
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
          creator: this.state.role,
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
            text: answerInput,
            showTime: true,
            creator: this.state.role
          })
        } else {
          newMessages.push({
            source: source,
            fileURL: answerInput,
            fileName,
            fileExtension,
            showTime: true,
            creator: this.state.role
          })
        }

        newMessages.push({
          source: 'text',
          text: inputValidatedObject.errorMessage,
          creator: botRole,
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
