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
      pointerEvents: 'auto'
    }

    this.handleStateValue = this.handleStateValue.bind(this)
  }

  handleStateValue (state, value) {
    this.setState({ [state]: value })
  }

  render () {
    const {
      message,
      currentQuestion
    } = this.props

    return (
      <ChatBubble style={styles.container}>
        <View style={styles.innerContainer}>
          <RadioChoices
            choices={message.widget.options}
            onChange={(option) => {
              if (message.node === currentQuestion.node) {
                this.handleStateValue('pointerEvents', 'none')
                this.props.submitInputValue(currentQuestion, option.label, option.value, 'radio')
              }
            }}
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
