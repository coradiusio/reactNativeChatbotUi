import React from 'react'
import { StyleSheet, View } from 'react-native'

import ChatBotApp from './src/ChatBotApp'

import {
  colors
} from './src/utils'

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
