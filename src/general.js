import {
  Alert as _Alert,
  ToastAndroid
} from 'react-native'

export const Toast = (text) => {
  ToastAndroid.showWithGravityAndOffset(
    text,
    ToastAndroid.LONG,
    ToastAndroid.BOTTOM,
    25,
    50
  )
}

export const Alert = (title, text, okPressCallback) => {
  _Alert.alert(
    title,
    text,
    [
      {
        text: 'OK',
        onPress: () => {
          if (typeof okPressCallback === 'function') {
            okPressCallback()
          }
        }
      }
    ]
  )
}

export const genericColors = {
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#00C853',
  grey100: '#F5F5F5',
  blue: '#2962FF',
  lightGrey: '#9E9E9E',
  darkGrey: '#4F5D64'
}

export const colors = {
  primary: genericColors.blue,
  headerTitleColor: genericColors.white,
  headerSubTitleColor: genericColors.white,
  errorIconColor: genericColors.red,
  background: genericColors.white,
  headerIconColor: genericColors.white,
  onlineIconColor: genericColors.green,

  receiverBubbleBackground: genericColors.grey100,
  receiverBubbleText: genericColors.darkGrey,
  senderBubbleBackground: genericColors.blue,
  senderBubbleText: genericColors.white
}
