import React from 'react'

import {
  StyleSheet,
  View,
  Keyboard
} from 'react-native'

import { isUndefined, isEmpty } from 'lodash'

import * as Animatable from 'react-native-animatable'

import dayjs from 'dayjs'

import {
  DateTimePicker,
  Button,
  ChatInput
} from 'reactNativeBasicComponents'

import {
  CreateComponentFromJSON
} from '../react_component_json'

import SearchableSelect from './sub_components/SearchableSelect'

import {
  colors,
  genericColors
} from '../utils'

class Footer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      inputText: '',
      isDatePickerVisible: false
    }
  }

  componentDidMount () {
    const {
      inputText
    } = this.props

    if (!isUndefined(inputText) && !isEmpty(inputText)) {
      this.inputTextSetter(inputText)
    }
  }

  inputTextSetter (value) {
    this.setState({
      inputText: value
    })
  }

  componentWillReceiveProps (nextProps) {
    const {
      inputText
    } = nextProps

    if (!isUndefined(inputText) && inputText !== this.state.inputText) {
      this.inputTextSetter(inputText)
    }
  }

  handleSubmit () {
    this.props.submitInputValue(this.state.inputText.trim())
  }

  handleSelect (value) {
    this.props.submitInputValue(value)
  }

  showDateTimePicker = () => this.setState({ isDatePickerVisible: true })

  hideDateTimePicker = () => this.setState({ isDatePickerVisible: false })

  handleDatePicked = (date) => {
    this.props.submitInputValue(dayjs(date).format(this.props.currentQuestion.output.format || 'YYYY-MM-DD'))
    this.hideDateTimePicker()
  }

  inputSubmitHandler = () => {
    this.props.handleSenderTyping(false)
    this.handleSubmit()
  }

  componentDecider () {
    const {
      currentQuestion
    } = this.props

    const {
      widget,
      placeholder,
      keyboardType,
      minCharactersToSearch,
      searchKeyName
    } = currentQuestion.input || {}

    switch (widget) {
      case 'text':
        return (
          <ChatInput
            onChange={(text) => this.props.handleStateValue('inputText', text)}
            onFocus={() => this.props.handleSenderTyping(true)}
            onBlur={() => this.props.handleSenderTyping(false)}
            onSubmitEditing={() => this.inputSubmitHandler()}
            onSendIconPress={() => {
              Keyboard.dismiss()
              this.inputSubmitHandler()
            }}
            sendIcon={this.props.icon}
            inputText={this.state.inputText}
            keyboardType={keyboardType || 'default'}
          />
        )
      case 'calendar':
        return (
          <View style={styles.flexView}>
            <Button
              style={buttonStyles}
              buttonContainerStyle={styles.buttonContainerStyle}
              text={placeholder || 'Click To Scan'}
              onPress={this.showDateTimePicker}
            />
            <DateTimePicker
              isVisible={this.state.isDatePickerVisible}
              onConfirm={this.handleDatePicked}
              onCancel={this.hideDateTimePicker}
            />
          </View>
        )
      case 'file':
      case 'qrscanner':
      case 'camera':
        return (
          <View style={styles.flexView}>
            <Button
              style={buttonStyles}
              buttonContainerStyle={styles.buttonContainerStyle}
              text={placeholder || 'Click Here'}
              onPress={() => this.props.handleStateValue('openCameraView', true)}
            />
          </View>
        )
      case 'searchselect':
        return (
          <View style={styles.flexView}>
            <SearchableSelect
              dataSource={currentQuestion.input.searchOptions || []}
              minCharToSearch={minCharactersToSearch || 3}
              renderItemProps={item => CreateComponentFromJSON(currentQuestion.input.renderItemProps, item)}
              searchKeyName={searchKeyName}
              onSelect={(value) => this.handleSelect(value)}
            />
          </View>
        )
      default:
        return null
    }
  }

  render () {
    return (
      <Animatable.View
        animation={this.props.isEditingMode ? 'flipInY' : 'slideInUp'}
        duration={500}
        useNativeDriver
      >
        <View style={styles.container}>
          {this.componentDecider()}
        </View>
      </Animatable.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    height: 48
  },
  inputContainer: {
    backgroundColor: colors.white,
    flex: 1,
    borderRadius: 32,
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  flexView: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  inputContainerStyle: {
    flex: 1
  },
  iconContainerStyle: {
    minWidth: 40,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  buttonContainerStyle: {
    padding: 0
  }
})

const buttonStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    height: 48
  },
  text: {
    color: genericColors.white
  }
})

export default Footer
