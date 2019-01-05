import React from 'react'

import {
  AppRegistry
} from 'react-native'

import {
  platform
} from './general'

import App from './ChatBotApp'

if (platform === 'web') {
  AppRegistry.runApplication('App', {
    rootTag: document.getElementById('root')
  })
}
