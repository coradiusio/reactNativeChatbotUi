import React from 'react'

import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import ChatBubble from './ChatBubble'

import {
  colors
} from '../../../utils'

dayjs.extend(isSameOrAfter)

class DateComponent extends React.PureComponent {
  render () {
    const {
      date
    } = this.props

    let _date = dayjs(date)

    const today = dayjs()

    let dateTextToBeRendered
    const isSame = today.isSame(_date, 'date')

    if (isSame) {
      dateTextToBeRendered = 'Today'
    } else if (_date.isSameOrAfter(today.subtract(1, 'day').startOf('day'))) {
      dateTextToBeRendered = 'Yesterday'
    } else {
      dateTextToBeRendered = _date.format('DD-MMM-YYYY')
    }

    return (
      <ChatBubble style={styles.container} isError={this.props.isError}>
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
