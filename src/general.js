import {
  Alert as _Alert,
  ToastAndroid,
  Platform
} from 'react-native'

export const platform = Platform.OS

export const Toast = (text) => {
  if (platform === 'android') {
    ToastAndroid.showWithGravityAndOffset(
      text,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50
    )
  } else {
    alert(text)
  }
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
