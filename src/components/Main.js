import React from 'react'

import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  BackHandler
} from 'react-native'

import Header from './Header'
import Body from './Body'
import Footer from './Footer'

import Progress from './sub_components/Progress'
import Camera from './sub_components/Camera'
import QRCodeScanner from './sub_components/QRCodeScanner'

import {
  platform
} from '../general'

export default class Main extends React.PureComponent {
  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
  }

  handleBackPress = () => {
    if (this.props.openCameraView) {
      this.props.handleStateValue('openCameraView', false)
      return true
    } else {
      return false
    }
  }

  render () {
    const {
      botMode,
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
      uiData,

      fetchMessagesHistory,
      handleEditPress,
      handleFinishedEdit,
      handleNextQuestion,
      handleRadioButton,
      handleStateValue,
      handleSenderTyping,
      submitInputValue
    } = this.props

    const {
      widget
    } = currentQuestion.input || {}

    const noMessageAvailable = messages.length === 0

    console.log('platform :- ', platform)

    return (
      <View style={styles.flexView}>
        {
          openCameraView
            ? <View style={styles.flexView}>
              {
                widget === 'qrscanner' && platform !== 'web'
                  ? <QRCodeScanner
                    onRead={(e) => {
                      handleStateValue('openCameraView', false)
                      submitInputValue(e.data)
                    }}
                    cameraProps={currentQuestion.input.cameraProps}
                    showMarker
                  />
                  : <View style={styles.flexView}>
                    {
                      (widget === 'camera' || widget === 'file') && platform !== 'web'
                        ? <Camera
                          handleStateValue={handleStateValue}
                          onCapture={submitInputValue}

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
                isReceiverTyping={isReceiverTyping}
              />
              <KeyboardAvoidingView style={styles.flexView} behavior='padding' keyboardVerticalOffset={-500}>
                <Body
                  loader={uiData.loader}
                  messages={messages}
                  currentQuestion={currentQuestion}
                  handleNextQuestion={handleNextQuestion}
                  handleStateValue={handleStateValue}
                  noMessageAvailable={noMessageAvailable}
                  role={role}
                  botMode={botMode}
                  fetchMessagesHistory={fetchMessagesHistory}
                  handleEditPress={handleEditPress}
                  handleRadioButton={handleRadioButton}
                  isEditingMode={isEditingMode}
                  currentEditingMessageId={currentEditingMessageId}
                  currentEditingAnswerOptionsMessageId={currentEditingAnswerOptionsMessageId}
                  handleFinishedEdit={handleFinishedEdit}
                />
                {
                  !noMessageAvailable && isUserAllowedToAnswer && (isEditingMode ? widget !== 'radio' : true)
                    ? <Footer
                      icon={uiData.footer.icon}
                      submitInputValue={submitInputValue}
                      handleStateValue={handleStateValue}
                      isUserAllowedToAnswer={isUserAllowedToAnswer}
                      currentQuestion={currentQuestion}
                      handleSenderTyping={handleSenderTyping}
                      inputText={inputText}
                      isEditingMode={isEditingMode}
                    />
                    : null
                }
              </KeyboardAvoidingView>
            </View>
        }
        {
          showProgress
            ? <Progress />
            : null
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
