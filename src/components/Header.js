import React from 'react'

import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity
} from 'react-native'

import {
  Icon,
  Title,
  SubTitle
} from 'reactNativeBasicComponents'

import {
  colors
} from '../utils'

class Header extends React.PureComponent {
  render () {
    const {
      title,
      subtitle,
      icon
    } = this.props

    console.log('icon :- ', icon)

    return (
      <View
        style={styles.container}
      >
        <TouchableOpacity
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
            <Icon
              color={colors.headerIconColor}
              name={'search1'}
              type={'ant-design'}
              size={24}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={[styles.iconWrapper, styles.rightIconWrapper, { marginRight: 0 }]}
          >
            <Icon
              color={colors.headerIconColor}
              name={'customerservice'}
              type={'ant-design'}
              size={24}
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
    paddingRight: 24,
    ...Platform.select({
      android: {
        elevation: 4
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2
      }
    })
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
  }
})

export default Header
