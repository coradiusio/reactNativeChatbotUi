import React from 'react'

import {
  View,
  StyleSheet
} from 'react-native'

import {
  RadioChoices
} from 'reactNativeBasicComponents'

import ChatBubble from './ChatBubble'

import {
  colors
} from '../../../utils'

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

  componentWillReceiveProps (nextProps) {
    if (nextProps.pointerEvents !== this.state.pointerEvents) {
      this.setState({ pointerEvents: nextProps.pointerEvents })
    }
    if (nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value })
    }
  }

  handleStateValue (state, value) {
    this.setState({ [state]: value })
  }

  render () {
    const {
      message
    } = this.props

    return (
      <ChatBubble style={styles.container}>
        <View style={styles.innerContainer}>
          <RadioChoices
            choices={message.quick_replies}
            onChange={(option) => {
              this.props.handleRadioButton(this.props.messageId, option.label, option.value)
            }}
            value={this.state.value}
            buttonsContainerStyle={styles.buttonsContainer}
            containerStyle={[styles.buttonContainer, this.state.pointerEvents === 'none' ? styles.dimBorder : null]}
            fillContainerStyle={[styles.fillContainer, this.state.pointerEvents === 'none' ? styles.dimBackground : null]}
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
    marginTop: 0,
    marginBottom: 0,
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  buttonContainer: {
    borderColor: colors.radioColor,
    marginTop: 4,
    paddingTop: 0,
    paddingBottom: 0
  },
  fillContainer: {
    backgroundColor: colors.radioColor
  },
  dimBorder: {
    borderColor: 'rgba(33,150,243,0.5)'
  },
  dimBackground: {
    backgroundColor: 'rgba(33,150,243,0.5)'
  }
})

export default RadioButtons
