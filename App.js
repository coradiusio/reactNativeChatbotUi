import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import FormBotApp from './src/FormBotApp';

import {
  colors
} from './src/general';

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uiData: this.props.uiData || {
        header: {
          title: 'Chatbot Assistant',
          subtitle: 'online',
          icon: {
            name: 'robot',
            type: 'material-community',
            color: colors.white,
            size: 40
          },
          subtitleIcon: {
            name: 'circle',
            type: 'material-community',
            color: colors.green,
            size: 12
          },
        },
        body: {
          loader: {
            color: colors.primary,
            size: 'small'
          },
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
      logicalData: {
        result: this.props.result || {},
        currentNode: 0,
        currentMessageIndex: 0,
        messages: this.props.messages || [],
        repliedMessages: [],
        isBotTyping: false,
        isUserTyping: false,
        isUserAllowedToAnswer: false,
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prevState => ({
      ...prevState,
      logicalData: {
        ...prevState.logicalData,
        messages: nextProps.messages
      }
    }));
  }

  render() {
    const {
      uiData,
      logicalData
    } = this.state;

    console.log('logicalData :- ', logicalData);

    return (
      <View style={styles.container}>
        <FormBotApp uiData={uiData} logicalData={logicalData} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
});


