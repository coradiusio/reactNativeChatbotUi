import {
  AppRegistry
} from 'react-native'

import {
  platform
} from './src/general'

import App from './App'
import { name as appName } from './app.json'

if (platform === 'web') {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root')
  })
} else {
  AppRegistry.registerComponent(appName, () => App)
}
