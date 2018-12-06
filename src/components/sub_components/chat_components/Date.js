import React from 'react'

import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import ChatBubble from './ChatBubble'

import {
  colors
} from '../../../general'

import {
  ddMMMYYYY
} from '../../../utils'

class DateComponent extends React.PureComponent {
  render () {
    const {
      date
    } = this.props

    let _date

    if (typeof date === 'string') {
      _date = new Date(date)
    } else {
      _date = date
    }

    const today = new Date()

    let dateTextToBeRendered

    if (today.getDate() === _date.getDate()) {
      dateTextToBeRendered = 'Today'
    } else {
      dateTextToBeRendered = ddMMMYYYY(_date)
    }

    return (
      <ChatBubble style={styles.container} isTyping={this.props.isTyping} isError={this.props.isError}>
        <View style={styles.innerContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.font}>{dateTextToBeRendered}</Text>
          </View>
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
    margin: 8,
    alignSelf: 'center'
  },
  textContainer: {
    backgroundColor: colors.primary,
    padding: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 8
  },
  font: {
    color: colors.senderBubbleText,
    fontSize: 12
  }
})

export default DateComponent
