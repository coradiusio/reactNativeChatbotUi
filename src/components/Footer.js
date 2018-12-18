import React from 'react'

import {
  Animated,
  StyleSheet,
  View,
  Keyboard,
  Text
} from 'react-native'

import * as Animatable from 'react-native-animatable'

import {
  DateTimePicker,
  Button,
  ChatInput
} from 'reactNativeBasicComponents'

import SearchableSelect from './sub_components/SearchableSelect'

import {
  colors
} from '../general'

import {
  formatDate
} from '../utils'

class Footer extends React.PureComponent {
  constructor (props) {
    super(props)
    this.animatedValue = new Animated.Value(0)
    this.state = {
      inputText: '',
      isDatePickerVisible: false
    }
  }

  componentDidMount () {
    if (this.props.inputText) {
      this.inputTextSetter()
    }
    this.backgroundColorAnimation()
  }

  inputTextSetter (value) {
    this.setState({
      inputText: value
    })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.inputText !== this.state.inputText) {
      this.inputTextSetter(nextProps.inputText)
    }
  }

  handleSubmit () {
    this.props.submitInputValue(this.props.currentQuestion, this.state.inputText.trim())
  }

  handleSelect (value) {
    this.props.submitInputValue(this.props.currentQuestion, value)
  }

  showDateTimePicker = () => this.setState({ isDatePickerVisible: true })

  _hideDateTimePicker = () => this.setState({ isDatePickerVisible: false })

  _handleDatePicked = (date) => {
    this.props.submitInputValue(this.props.currentQuestion, formatDate(date))
    this._hideDateTimePicker()
  }

  inputSubmitHandler = () => {
    this.props.handleSenderTyping(false)
    this.handleSubmit()
    if (!this.props.isEditingMode) {
      this.props.handleStateValue('inputText', '')
    }
  }

  componentDecider () {
    const {
      currentQuestion
    } = this.props

    const {
      widget,
      placeholder
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
          />
        )
      case 'calendar':
        return (
          <View style={styles.flexView}>
            <Button
              style={buttonStyles}
              buttonContainerStyle={styles.buttonContainerStyle}
              text={placeholder || 'Click To Scan'}
              onPress={this._showDateTimePicker}
            />
            <DateTimePicker
              isVisible={this.state.isDatePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
            />
          </View>
        )
      case 'qrscanner':
      case 'camera':
        return (
          <View style={styles.flexView}>
            <Button
              style={buttonStyles}
              buttonContainerStyle={styles.buttonContainerStyle}
              text={placeholder || 'Click To Open Camera'}
              onPress={() => this.props.handleStateValue('openCameraView', true)}
            />
          </View>
        )
      case 'searchselect':
        return (
          <View style={styles.flexView}>
            <SearchableSelect
              dataSource={[
                {
                  id: 1,
                  value: {
                    pincode: '400053',
                    city: 'Andheri',
                    state: 'Maharashtra'
                  }
                },
                {
                  id: 2,
                  value: {
                    pincode: '400052',
                    city: 'Andheri',
                    state: 'Maharashtra'
                  }
                },
                {
                  id: 3,
                  value: {
                    pincode: '400051',
                    city: 'Bandra',
                    state: 'Maharashtra'
                  }
                },
                {
                  id: 4,
                  value: {
                    pincode: '600053',
                    city: 'Andheri',
                    state: 'Delhi'
                  }
                },
                {
                  id: 5,
                  value: {
                    pincode: '700053',
                    city: 'Andheri',
                    state: 'Maharashtra'
                  }
                },
                {
                  id: 6,
                  value: {
                    pincode: '300053',
                    city: 'Andheri',
                    state: 'Maharashtra'
                  }
                }
              ]}
              minCharToSearch={3}
              renderItemProps={item => (
                <View style={{ padding: 10, margin: 4 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Pincode: {item.value.pincode}</Text>
                  <Text style={{ fontSize: 14 }}>City: {item.value.city}</Text>
                  <Text style={{ fontSize: 14 }}>State: {item.value.state}</Text>
                </View>
              )}
              searchKeyName='pincode'
              onSelect={(value) => this.handleSelect(value)}
            />
          </View>
        )
      default:
        return null
    }
  }

  backgroundColorAnimation () {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 100,
        duration: 1000
      }
    ).start(() => { this.backgroundColorAnimation() })
  }

  wrapper (component) {
    const backgroundColor = this.props.isEditingMode ? this.animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [colors.primary, colors.receiverBubbleBackground]
    }) : null

    return (
      <View>
        {
          this.props.isEditingMode
            ? <Animated.View
              style={{ backgroundColor }}
            >
              <View style={styles.container}>
                {component}
              </View>
            </Animated.View>
            : <View style={styles.container}>
              {component}
            </View>
        }
      </View>
    )
  }

  render () {
    return (
      <Animatable.View
        animation='slideInUp'
        duration={500}
        useNativeDriver
      >
        {this.wrapper(this.componentDecider())}
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
    color: colors.white
  }
})

export default Footer
