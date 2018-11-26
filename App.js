import React from 'react'
import { StyleSheet, View } from 'react-native'

import FormBotApp from './src/FormBotApp'

import {
  colors
} from './src/general'

export default class App extends React.PureComponent {
  render () {
    return (
      <View style={styles.container}>
        <FormBotApp
          host={this.props.host}
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
