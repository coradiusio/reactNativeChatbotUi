import React from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  Text,
} from 'react-native';

import {
  Icon,
  TextInput,
  DateTimePicker,
  Button,
  ChatInput
} from 'reactNativeBasicComponents';

import SearchableSelect from './sub_components/SearchableSelect';

import {
  colors
} from '../general';

import {
  formatDate
} from '../utils';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      resetInputValue: false,
      isDatePickerVisible: false
    }
  }

  handleInputText(value) {
    this.setState({ inputText: value });
  }

  handleSubmit() {
    this.props.submitInputValue(this.state.inputText.trim());
  }

  handleSelect(value) {
    this.props.submitInputValue(value);
  }

  _showDateTimePicker = () => this.setState({ isDatePickerVisible: true });

  _hideDateTimePicker = () => this.setState({ isDatePickerVisible: false });

  _handleDatePicked = (date) => {
    this.props.submitInputValue(formatDate(date));
    this._hideDateTimePicker();
  };

  componentDecider() {
    const {
      currentQuestion
    } = this.props;

    switch(currentQuestion.widget) {
      case 'text':
        return (
          <ChatInput
            onChange={(text) => this.handleInputText(text)}
            onFocus={() => this.props.handleStateValue('isUserTyping', true)}
            onBlur={() => this.props.handleStateValue('isUserTyping', false)}
            onSubmitEditing={() => {
              this.handleSubmit();
              this.handleInputText('');
            }}
            onSendIconPress={() => {
              Keyboard.dismiss();
              this.handleSubmit();
              this.handleInputText('');
            }}
            sendIcon={this.props.icon}
            inputText={this.state.inputText}
          />
        );
      case 'calendar':
        return (
          <View style={styles.flexView}>
            <Button
              style={buttonStyles}
              buttonContainerStyle={styles.buttonContainerStyle}
              text={currentQuestion.placeholder || 'Click To Scan'}
              onPress={this._showDateTimePicker}
            />
            <DateTimePicker
              isVisible={this.state.isDatePickerVisible}
              onConfirm={this._handleDatePicked}
              onCancel={this._hideDateTimePicker}
            />
          </View>
        );
      case 'qrscanner':
      case 'camera':
        return (
          <View style={styles.flexView}>
            <Button
              style={buttonStyles}
              buttonContainerStyle={styles.buttonContainerStyle}
              text={currentQuestion.placeholder || 'Click To Open Camera'}
              onPress={() => this.props.handleStateValue('openCameraView', true)}
            />
          </View>
        );
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
                },
              ]}
              minCharToSearch={3}
              renderItemProps={item => (
                <View style={{ padding: 10, margin: 4 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Pincode: {item.value.pincode}</Text>
                  <Text style={{ fontSize: 14, }}>City: {item.value.city}</Text>
                  <Text style={{ fontSize: 14 }}>State: {item.value.state}</Text>
                </View>
              )}
              searchKeyName='pincode'
              onSelect={(value) => this.handleSelect(value)}
            />
          </View>
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        {this.componentDecider()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    height: 48,
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
    shadowOpacity: 1.0,
  },
  flexView: {
    flex: 1
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  inputContainerStyle: {
    flex: 1,
  },
  iconContainerStyle: {
    minWidth: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  buttonContainerStyle: {
    padding: 0,
  },
});

const buttonStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    height: 48
  },
  text: {
    color: colors.white
  }
});

export default Footer;