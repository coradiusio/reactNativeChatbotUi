import React from 'react'

import {
  View,
  StyleSheet,
  Dimensions
} from 'react-native'

import InfiniteCalendar from 'react-infinite-calendar'
import 'react-infinite-calendar/styles.css'

import Modal from 'modal-react-native-web'

import {
  isMobile
} from '../../utils'

const displayOptions = {
  showTodayHelper: false,
  showWeekdays: false,
  showOverlay: false
}

const dimensions = Dimensions.get('window')

export default class DatePicker extends React.PureComponent {
  getWidth () {
    const width = dimensions.width
    if (width > 400) return 400
    return Number(width) - 50
  }

  getHeight () {
    const height = dimensions.height
    if (height > 500) return 500
    return Number(height) - 50
  }

  render () {
    return (
      <View>
        {
          isMobile()
            ? <input type='date' id='input-date' onChange={event => this.props.onConfirm(event.target.value)} style={dateInputStyles} />
            : <Modal onDismiss={() => null} visible={this.props.isVisible} transparent>
              <View style={styles.container}>
                <InfiniteCalendar
                  width={this.getWidth()}
                  height={this.getHeight()}
                  displayOptions={displayOptions}
                  onSelect={this.props.onConfirm}
                />
              </View>
            </Modal>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  calendar: {
    display: 'none'
  }
})

const dateInputStyles = {
  width: 0,
  height: 0,
  border: 'none',
  opacity: 0,
  pointerEvents: 'none'
}
