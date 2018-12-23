import React from 'react'

import {
  View,
  Text,
  StyleSheet
} from 'react-native'

import ReceiverChatBubble from './ReceiverChatBubble'

import {
  Icon
} from 'reactNativeBasicComponents'

import {
  colors
} from '../../../utils'

class ErrorBubble extends React.PureComponent {
  render () {
    return (
      <ReceiverChatBubble isError>
        <View style={styles.flexDirectionRow}>
          <View style={styles.errorIconContainer}>
            <Icon
              color={colors.errorIconColor}
              name={'error'}
              type={'material-icon'}
              size={16}
            />
          </View>
          <View style={styles.minWidth}>
            <Text style={styles.fontColor}>
              {this.props.errorMessage}
            </Text>
          </View>
        </View>
      </ReceiverChatBubble>
    )
  }
}

const styles = StyleSheet.create({
  minWidth: {
    minWidth: '25%'
  },
  flexDirectionRow: {
    flexDirection: 'row'
  },
  errorIconContainer: {
    marginRight: 8
  },
  fontColor: {
    color: colors.receiverBubbleText
  }
})

export default ErrorBubble
