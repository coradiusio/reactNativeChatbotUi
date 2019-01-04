/* global FormData */

import React from 'react'

import io from 'socket.io-client'
import feathers from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'

import axios from 'axios'
import {
  isUndefined,
  isEmpty
} from 'lodash'

import Main from './components/Main'

import {
  Alert,
  Toast
} from './general'

import {
  colors,
  validateInput,
  stringCasing,
  validateFile
} from './utils'

const uuidv4 = require('uuid/v4')

let timer

const botRole = {
  type: 'bot',
  displayName: 'Bot'
}

export default class ChatBotApp extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      botMode: 'question',
      currentEditingQuestion: {},
      currentEditingMessageId: '',
      currentEditingAnswerOptionsMessageId: '',
      currentQuestion: {},
      currentQuestionIndex: 0,
      inputText: '',
      isEditingMode: false,
      isReceiverTyping: false,
      isUserAllowedToAnswer: false,
      messages: [],
      openCameraView: false,
      role: { ...this.props.role },
      showProgress: false,
      uiData: this.props.uiData ? { ...this.props.uiData } : {
        header: {
          title: 'Chatbot Assistant',
          subtitle: 'online'
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
      }
    }

    // setup socket connection
    this.app = feathers()
      .configure(socketio(io(this.props.host,
        {
          transports: ['websocket']
        }
      )))

    this.messagesService = this.app.service('messages')
    this.questionsService = this.app.service('questions')

    this.submitInputValue = this.submitInputValue.bind(this)
    this.handleStateValue = this.handleStateValue.bind(this)
    this.handleSenderTyping = this.handleSenderTyping.bind(this)
    this.fetchMessagesHistory = this.fetchMessagesHistory.bind(this)
    this.handleEditPress = this.handleEditPress.bind(this)
    this.handleFinishedEdit = this.handleFinishedEdit.bind(this)
    this.handleRadioButton = this.handleRadioButton.bind(this)
  }

  componentDidMount () {
    this.handleEvents()
    this.fetchOldMessagesAndCreateNewQuestion()
  }

  componentWillUnmount () {
    if (timer) {
      clearTimeout(timer)
    }
    this.app = null
  }

  handleEvents () {
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
      const index = prevState.messages.findIndex(item => item.messageId === this.state.currentEditingMessageId)

      return ({
        messages: [ ...prevState.messages.slice(0, index), message, ...prevState.messages.slice(index + 1) ]
      })
    })
  }

  handleRemovedMessage (message) {
    this.setState(prevState => {
      return ({
        messages: [ ...prevState.messages.filter(item => item.messageId !== message.messageId) ]
      })
    })
  }

  handleStateValue (state, value) {
    console.log(`Setting ${state} :- ${value}`)
    this.setState({ [state]: value })
  }

  handleSenderTyping (value) {
    // do something here
  }

  fetchOldMessagesAndCreateNewQuestion () {
    this.fetchMessagesHistory()
      .then(() => {
        this.fetchNextQuestion()
      })
      .catch(err => {
        console.log('error :- ', err)
      })
  }

  fetchMessagesHistory (messageId, callback) {
    return new Promise((resolve, reject) => {
      this.messagesService.find({ query: { messageId } })
        .then(response => {
          if (response.data instanceof Array && response.data.length > 0) {
            this.setState(prevState => ({
              messages: [ ...response.data, ...prevState.messages ]
            }), () => {
              if (typeof callback === 'function') {
                callback()
              }
              resolve()
            })
          } else {
            if (messageId) {
              Toast('No More Messages Available !')
            }
            resolve()
          }
        })
        .catch(err => {
          console.log('err in fetching messages history :- ', err)
          Toast('Coundn\'t be able to connect to Server, Something Went Wrong !')
          reject(err)
        })
    })
  }

  fetchNextQuestion () {
    this.questionsService.find(
      {
        query: {
          $limit: 1,
          lastQuestionNode: ((this.state.messages.filter(item => item.isQuestion).slice(-1))[0] || {}).node
        }
      }
    )
      .then(response => {
        console.log('next question :- ', response.data)
        if (response.data instanceof Array && response.data.length > 0) {
          this.setState({
            currentQuestion: response.data[0]
          }, () => {
            this.handleNextQuestion()
          })
        } else {
          if (!isEmpty(this.state.currentQuestion)) {
            this.setState({ currentQuestion: {} })
          }
        }
      })
      .catch(err => {
        console.log('err in fetching next question :- ', err)
      })
  }

  handleNextQuestion () {
    this.setState({
      isUserAllowedToAnswer: false,
      isReceiverTyping: true
    }, () => {
      timer = setTimeout(() => {
        const {
          currentQuestion
        } = this.state

        if (!isEmpty(currentQuestion)) {
          const {
            question,
            input = {}
          } = currentQuestion

          if (!isUndefined(question) && !isEmpty(question)) {
            const {
              widget
            } = input

            const questionArray = question instanceof Array ? question : (typeof question === 'string' ? [ question ] : [])

            const { currentQuestionIndex } = this.state

            if (questionArray.length > 0) {
              const lastMessages = []
              if (currentQuestionIndex === questionArray.length - 1) {
                lastMessages.push({
                  message: {
                    text: questionArray[currentQuestionIndex]
                  },
                  sender: botRole,
                  showTime: true,
                  isQuestion: true,
                  node: currentQuestion.node,
                  messageId: uuidv4()
                })

                if (widget === 'radio' || widget === 'checkbox') {
                  let optionsMessages = {
                    message: {
                      quick_replies: currentQuestion.input[widget === 'radio' ? 'radioOptions' : 'checkboxOptions']
                    },
                    input: {
                      widget: widget
                    },
                    state: { ...currentQuestion.state },
                    sender: botRole,
                    isQuestion: true,
                    node: currentQuestion.node,
                    isAnswerOptions: true,
                    showTime: true,
                    messageId: uuidv4()
                  }

                  if (widget === 'checkbox') {
                    optionsMessages.joinWith = currentQuestion.input.validateInput.joinWith || ','
                  }

                  lastMessages.push(optionsMessages)
                }

                this.createNewMessage(lastMessages)
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
                this.createNewMessage({
                  message: {
                    text: questionArray[currentQuestionIndex]
                  },
                  isQuestion: true,
                  node: currentQuestion.node,
                  sender: botRole,
                  messageId: uuidv4()
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
          } else {
            this.setState({ isReceiverTyping: false })
          }
        }
      }, 500)
    })
  }

  createNewMessage (data, params = {}) {
    return this.messagesService.create(data, params)
  }

  updateExistingMessage (id, data, params = {}) {
    if (id) {
      return this.messagesService.update(id, data, params)
    }
    throw new Error('id should not be undefined or null')
  }

  patchExistingMessage (id, data, params = {}) {
    return this.messagesService.patch(id, data, params)
  }

  handleEditPress (messageId) {
    if (!this.state.isEditingMode) {
      this.setState({
        isEditingMode: true,
        currentEditingMessageId: messageId
      })
      const messageItem = this.state.messages.filter(item => item.messageId === messageId)[0]
      console.log('editing message item :- ', messageItem)
      if (!(isUndefined(messageItem) || isEmpty(messageItem))) {
        if (!(isUndefined(messageItem.answerOfNode) || isEmpty(messageItem.answerOfNode))) {
          // first fetch question of this node i.e answerOfNode
          this.questionsService.find({ query: { node: messageItem.answerOfNode } })
            .then(response => {
              if (response.data instanceof Array && response.data.length > 0) {
                const question = response.data[0]
                const {
                  widget
                } = question.input || {}

                if (widget === 'text') {
                  this.setState({
                    currentEditingQuestion: { ...question },
                    inputText: messageItem.message.text,
                    isUserAllowedToAnswer: true
                  })
                } else if (widget === 'radio') {
                  const index = this.state.messages.findIndex(item => item.messageId === messageId)
                  if (index > 0) {
                    this.setState({
                      currentEditingQuestion: { ...question },
                      currentEditingAnswerOptionsMessageId: this.state.messages[index - 1].messageId
                    })
                  }
                } else if (['calendar', 'camera', 'file', 'qrscanner'].indexOf(widget) > -1) {
                  const index = this.state.messages.findIndex(item => item.messageId === messageId)
                  if (index > 0) {
                    this.setState({
                      currentEditingQuestion: { ...question },
                      isUserAllowedToAnswer: true
                    })
                  }
                }
              } else {
                // coudn't find any question of that node
              }
            })
            .catch(err => {
              console.log('coundn\'t found question', err)
            })
        }
      }
    }
  }

  handleFinishedEdit () {
    this.setState({
      showProgress: false,
      isEditingMode: false,
      currentEditingMessageId: '',
      inputText: '',
      currentEditingAnswerOptionsMessageId: '',
      currentEditingQuestion: {}
    }, () => {
      if (this.state.botMode === 'question' && isEmpty(this.state.currentQuestion)) {
        this.setState({ isUserAllowedToAnswer: false })
      }
    })
  }

  handleRadioButton (messageId, label, value) {
    const messageItem = JSON.parse(JSON.stringify((this.state.messages.filter(item => item.messageId === messageId))[0] || {}))
    if (!isEmpty(messageItem)) {
      const {
        currentEditingMessageId
      } = this.state

      this.setState({ currentEditingMessageId: messageId })

      if (!isEmpty(label)) {
        messageItem.state.label = label
      }
      if (!isEmpty(value)) {
        messageItem.state.value = value
      }

      this.patchExistingMessage(null, messageItem, { query: { messageId: messageItem.messageId } })
        .then(() => {
          this.setState({ currentEditingMessageId }, () => {
            this.submitInputValue(label, value, 'radio', { ...messageItem.state })
          })
        })
        .catch(err => {
          Toast('Something Went Wrong, Coudn\'t update message')
          console.log('Something Went Wrong, Coudn\'t update message :- ', err)
          this.handleFinishedEdit()
        })
    }
  }

  computeRawValueForRadioOptions (currentQuestion, answerInput, formValue) {
    let rawValue
    const [ radioOption = {} ] = currentQuestion.input.radioOptions.filter(item => item.value === formValue).slice(0)
    if (!isUndefined(radioOption.displayText) && !isEmpty(radioOption.displayText)) {
      rawValue = radioOption.displayText
    } else if (!isUndefined(currentQuestion.output.value) && !isEmpty(currentQuestion.output.value)) {
      rawValue = currentQuestion.output.value
    } else {
      rawValue = answerInput
    }

    return rawValue
  }

  attachmentSetter (fileURL, fileExtension) {
    const message = {
      attachment: {
        type: ['jpg', 'jpeg', 'png'].indexOf(fileExtension.toLowerCase()) > -1 ? 'image' : 'file',
        payload: {
          url: fileURL,
          is_reusable: true
        }
      }
    }

    return message
  }

  uploadFile (url, base64) {
    const config = {
      timeout: 300000,
      onUploadProgress: function (progressEvent) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        console.log('percentCompleted :- ', percentCompleted)
      }
    }
    let formData = new FormData()
    formData.append('file', base64)
    axios.post(url, formData, config)
      .then(response => {
        console.log('file uploaded :- ', response)
      })
      .catch(err => {
        console.log('error in file uploading :- ', err)
      })
  }

  handleNewMessage (currentQuestion, answerInput, formValue, source, fileName, fileExtension, state) {
    const {
      widget
    } = currentQuestion.input || {}

    let newMessage
    if (widget !== 'file' && widget !== 'camera') {
      newMessage = {
        source,
        message: {
          text: answerInput
        },
        isAnswer: true,
        answerOfNode: currentQuestion.node,
        isRightAnswer: true,
        sender: this.state.role,
        showTime: true,
        messageId: uuidv4()
      }
      if (widget === 'radio') {
        newMessage.state = { ...state }
        newMessage.rawValue = this.computeRawValueForRadioOptions(currentQuestion, answerInput, formValue)
      }
    } else {
      newMessage = {
        message: this.attachmentSetter(answerInput, fileExtension),
        source,
        fileName,
        fileExtension,
        answerOfNode: currentQuestion.node,
        isAnswer: true,
        isRightAnswer: true,
        sender: this.state.role,
        showTime: true,
        messageId: uuidv4()
      }
    }

    this.createNewMessage(newMessage)
      .then(() => {
        // here we need to fetch answer validation if any thing wrong bcz of additional validation , if success then call fetchNextQuestion
        if (this.state.inputText !== '') {
          this.handleStateValue('inputText', '')
        }

        this.fetchNextQuestion()
      })
      .catch(err => {
        console.log('usr msg not sent :- ', err)
      })
  }

  handleEditedMessage (currentQuestion, answerInput, formValue, fileName, fileExtension, state) {
    const {
      widget
    } = currentQuestion.input || {}

    this.setState({ showProgress: true }, () => {
      const messageItem = JSON.parse(JSON.stringify((this.state.messages.filter(item => item.messageId === this.state.currentEditingMessageId))[0] || {}))
      console.log('messageItem :- ', messageItem)
      if (!isEmpty(messageItem)) {
        if (widget === 'text') {
          messageItem.message.text = this.state.inputText
        } else if (widget === 'radio') {
          messageItem.state = { ...state }
          messageItem.rawValue = this.computeRawValueForRadioOptions(currentQuestion, answerInput, formValue)
        } else if (['calendar', 'qrscanner'].indexOf(widget) > -1) {
          messageItem.message.text = answerInput
        } else if (['camera', 'file'].indexOf(widget) > -1) {
          messageItem.message = this.attachmentSetter(answerInput, fileExtension)
        }
        this.patchExistingMessage(null, messageItem, { query: { messageId: messageItem.messageId } })
          .then(() => {
            timer = setTimeout(() => {
              this.handleFinishedEdit()
            }, 1000)
          })
          .catch(err => {
            Toast('Something Went Wrong, Coudn\'t update message')
            console.log('Something Went Wrong, Coudn\'t update message :- ', err)
            this.handleFinishedEdit()
          })
      }
    })
  }

  handleErrorMessage (currentQuestion, inputValidatedObject, answerInput, source, fileName, fileExtension) {
    const {
      widget
    } = currentQuestion.input || {}

    if (inputValidatedObject.foundError) {
      const {
        errorMessage
      } = inputValidatedObject

      if (this.state.isEditingMode) {
        Alert('Error', isEmpty(errorMessage) ? 'Something Went Wrong !' : errorMessage)
      } else {
        let newMessages = []
        if (widget !== 'file' && widget !== 'camera') {
          newMessages.push({
            source,
            message: {
              text: answerInput
            },
            answerOfNode: currentQuestion.node,
            isAnswer: true,
            isRightAnswer: false,
            showTime: true,
            sender: this.state.role
          })
        } else {
          newMessages.push({
            message: this.attachmentSetter(answerInput, fileExtension),
            source: source,
            answerOfNode: currentQuestion.node,
            isAnswer: true,
            isRightAnswer: false,
            fileName,
            fileExtension,
            showTime: true,
            sender: this.state.role
          })
        }

        newMessages.push({
          source: 'text',
          message: {
            text: isEmpty(errorMessage) ? 'Something Went Wrong !' : errorMessage
          },
          sender: botRole,
          isError: true
        })

        this.createNewMessage(newMessages)
      }
    }
  }

  submitInputValue (answerInput, formValue = '', source = 'text', state, fileName = '', fileExtension = '') {
    const currentQuestion = JSON.parse(JSON.stringify(this.state.isEditingMode ? this.state.currentEditingQuestion : this.state.currentQuestion))

    if (currentQuestion.validateInput && currentQuestion.validateInput.casing) {
      answerInput = stringCasing(answerInput, currentQuestion.validateInput.casing.trim().toLowerCase())
    }

    let answerInputModified
    if (formValue !== '') {
      answerInputModified = formValue.replace(/\s\s+/g, ' ').trim()
    } else {
      answerInputModified = answerInput.replace(/\s\s+/g, ' ').trim()
    }

    let fullFileName = ''
    if (source === 'camera' && answerInput.indexOf('.') > -1) {
      fullFileName = answerInput.split('/').slice(-1)[0]
      fileName = fullFileName.split('.')[0]
      fileExtension = fullFileName.split('.')[1] || ''
    }

    let inputValidatedObject
    if (source !== 'file' && source !== 'camera') {
      inputValidatedObject = validateInput(currentQuestion, answerInputModified, source)
    } else {
      console.log('fileName :- ', fileName)
      console.log('fileExtension :- ', fileExtension)
      inputValidatedObject = validateFile(currentQuestion, answerInputModified, fileName, fileExtension)
    }

    console.log('inputValidatedObject :- ', inputValidatedObject)

    if (inputValidatedObject.success) {
      if (this.state.isEditingMode) {
        this.handleEditedMessage(currentQuestion, answerInput, formValue, fileName, fileExtension, state)
      } else {
        this.handleNewMessage(currentQuestion, answerInput, formValue, source, fileName, fileExtension, state)
      }
    } else {
      this.handleErrorMessage(currentQuestion, inputValidatedObject, answerInput, source, fileName, fileExtension)
    }
  }

  render () {
    const {
      botMode,
      currentEditingQuestion,
      currentEditingAnswerOptionsMessageId,
      currentEditingMessageId,
      currentQuestion,
      inputText,
      isEditingMode,
      isReceiverTyping,
      isUserAllowedToAnswer,
      messages,
      openCameraView,
      role,
      showProgress,
      uiData
    } = this.state

    return (
      <Main
        botMode={botMode}
        currentEditingAnswerOptionsMessageId={currentEditingAnswerOptionsMessageId}
        currentEditingMessageId={currentEditingMessageId}
        currentQuestion={isEditingMode ? currentEditingQuestion : currentQuestion}
        inputText={inputText}
        isEditingMode={isEditingMode}
        isReceiverTyping={isReceiverTyping}
        isUserAllowedToAnswer={isUserAllowedToAnswer}
        messages={messages}
        openCameraView={openCameraView}
        role={role}
        showProgress={showProgress}
        uiData={uiData}

        fetchMessagesHistory={this.fetchMessagesHistory}
        handleEditPress={this.handleEditPress}
        handleFinishedEdit={this.handleFinishedEdit}
        handleNextQuestion={this.handleNextQuestion}
        handleRadioButton={this.handleRadioButton}
        handleStateValue={this.handleStateValue}
        handleSenderTyping={this.handleSenderTyping}
        submitInputValue={this.submitInputValue}
      />
    )
  }
}
