import React from 'react'

import {
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native'

import Image from 'react-native-remote-svg'

import {
  Icon,
  Title,
  SubTitle
} from 'reactNativeBasicComponents'

import {
  colors
} from '../utils'

const backArrowIcon = require('../../public/images/chatbotBackarrow.svg')
const searchIcon = require('../../public/images/chatbotSearch.svg')
const agentIcon = require('../../public/images/chatbotRM.svg')

class Header extends React.PureComponent {
  render () {
    const {
      title,
      subtitle,
      icon
    } = this.props

    return (
      <View
        style={styles.container}
        elevation={4}
      >
        {
          typeof icon === 'object'
            ? <TouchableOpacity
              onPress={() => {}}
              style={[styles.iconWrapper, styles.leftIconWrapper]}
            >
              <Icon
                color={icon.color}
                name={icon.name}
                type={icon.type}
                size={icon.size}
              />
            </TouchableOpacity>
            : <TouchableOpacity
              onPress={() => {}}
              style={[styles.iconWrapper, styles.leftIconWrapper]}
            >
              <Image
                source={backArrowIcon}
                style={styles.image}
              />
            </TouchableOpacity>
        }
        <View style={styles.middleWrapper}>
          <Title
            text={title}
            style={styles.title}
          />
          <View
            style={styles.iconSubtitleWrapper}
          >
            <SubTitle
              text={this.props.isReceiverTyping ? 'Bot is typing...' : subtitle}
              style={styles.subtitle}
            />
          </View>
        </View>
        <View style={styles.rightWrapper}>
          <TouchableOpacity
            onPress={() => {}}
            style={[styles.iconWrapper, styles.rightIconWrapper]}
          >
            <Image
              source={searchIcon}
              style={styles.image}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={[styles.iconWrapper, styles.rightIconWrapper, { marginRight: 0 }]}
          >
            <Image
              source={agentIcon}
              style={styles.image}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

Header.defaultProps = {
  title: 'Chatbot Assistant',
  subtitle: 'online'
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    height: 64,
    flexDirection: 'row',
    padding: 12,
    paddingLeft: 24,
    paddingRight: 24
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftIconWrapper: {
    marginRight: 32
  },
  rightIconWrapper: {
    marginRight: 24
  },
  middleWrapper: {
    flex: 1
  },
  rightWrapper: {
    flexDirection: 'row'
  },
  title: {
    margin: 0,
    color: colors.headerTitleColor
  },
  iconSubtitleWrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  subtitle: {
    margin: 0,
    color: colors.headerSubTitleColor
  },
  image: {
    width: 24,
    height: 24
  }
})

export default Header
