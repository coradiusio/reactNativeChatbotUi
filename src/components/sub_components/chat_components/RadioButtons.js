import React from 'react'

import {
  View,
  StyleSheet
} from 'react-native'

import {
  RadioChoices
} from 'reactNativeBasicComponents'

import {
  colors
} from '../../../general'

import ChatBubble from './ChatBubble'

class RadioButtons extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      value: '',
      pointerEvents: 'auto'
    }

    this.handleStateValue = this.handleStateValue.bind(this)
  }

  componentDidMount () {
    if (this.props.pointerEvents) {
      this.setState({
        pointerEvents: this.props.pointerEvents
      })
    }

    if (this.props.value) {
      this.setState({
        value: this.props.value
      })
    }
  }

  handleStateValue (state, value) {
    this.setState({ [state]: value })
  }

  render () {
    const {
      message,
      node,
      currentQuestion
    } = this.props

    return (
      <ChatBubble style={styles.container}>
        <View style={styles.innerContainer}>
          <RadioChoices
            choices={message.quick_replies}
            onChange={(option) => {
              if (node === currentQuestion.node) {
                this.props.handleRadioButton(currentQuestion, this.props.messageId, option.label, option.value)
              }
            }}
            value={this.state.value}
            buttonsContainerStyle={styles.buttonsContainer}
            containerStyle={styles.buttonContainer}
            fillContainerStyle={styles.fillContainer}
            pointerEvents={this.state.pointerEvents}
          />
        </View>
      </ChatBubble>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start'
  },
  innerContainer: {
    maxWidth: '85%',
    minWidth: 100
  },
  buttonsContainer: {
    marginTop: 4,
    marginBottom: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonContainer: {
    borderColor: colors.primary,
    margin: 4
  },
  fillContainer: {
    backgroundColor: colors.primary
  }
})

export default RadioButtons
