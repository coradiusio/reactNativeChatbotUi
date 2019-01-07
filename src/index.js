import React from 'react'

import {
  View,
  StyleSheet,
  AppRegistry
} from 'react-native'

import ChatBotApp from './ChatBotApp'

import {
  colors
} from './utils'

export default class App extends React.PureComponent {
  render () {
    return (
      <View style={styles.container}>
        <ChatBotApp
          host={'http://192.168.42.63:7664'}
          role={{
            type: 'user',
            displayName: 'Robin'
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  }
})

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', { rootTag: document.getElementById('root') });
