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
