import React from 'react'

import {
  StyleSheet,
  View,
  Text
} from 'react-native'

class Time extends React.PureComponent {
  render () {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <Text style={[styles.text, this.props.textStyle]}>
          {this.props.text}
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent'
  },
  text: {
    fontSize: 10
  }
})

export default Time
