import React from 'react';
import { StyleSheet, View } from 'react-native';

import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';

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
        currentNode: 0,
        currentMessageIndex: 0,
        messages: this.props.messages || [],
        repliedMessages: [],
        isBotTyping: false,
        isUserTyping: false,
        isUserAllowedToAnswer: false,
      }
    }

    // setup socket connection
    this.app = feathers()
      .configure(socketio(io(this.props.host || 'http://localhost:7664', { transports: ['websocket'] })));
  }

  componentDidMount() {
    this.app.service('messages').on('created', message => {
      console.log('new message created :- ', message);
      this.onMessageReceive(message);
    });
  }

  componentWillUnmount() {
    this.app = null;
  }

  onMessageReceive(message) {
    const {
      messages
    } = this.state.logicalData;

    messages.push(message);

    this.setState(prevState => ({
      ...prevState,
      logicalData: {
        ...prevState.logicalData,
        messages
      }
    }));
  }

  render() {
    const {
      uiData,
      logicalData
    } = this.state;

    return (
      <View style={styles.container}>
        <FormBotApp
          uiData={uiData}
          logicalData={logicalData}
          app={this.app}
        />
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


