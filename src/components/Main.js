import React from 'react'

import {
  StyleSheet,
  View,
  KeyboardAvoidingView
} from 'react-native'

import Header from './Header'
import Body from './Body'
import Footer from './Footer'

import Progress from './sub_components/Progress'
import Camera from './sub_components/Camera'
import QRCodeScanner from './sub_components/QRCodeScanner'

export default class Main extends React.PureComponent {
  render () {
    const {
      botMode,
      currentEditingAnswerOptionsMessageId,
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

    return (
      <View style={styles.flexView}>
        {
          openCameraView
            ? <View style={styles.flexView}>
              {
                widget === 'qrscanner'
                  ? <QRCodeScanner
                    onRead={(e) => {
                      handleStateValue('openCameraView', false)
                      submitInputValue(e.data)
                    }}
                    cameraProps={currentQuestion.input.cameraProps}
                  />
                  : <View style={styles.flexView}>
                    {
                      widget === 'camera' || widget === 'file'
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
                  currentEditingAnswerOptionsMessageId={currentEditingAnswerOptionsMessageId}
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
