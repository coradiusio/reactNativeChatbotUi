import React from 'react';

import {
  StyleSheet,
  View
} from 'react-native';

import {
  Icon,
  Title,
  SubTitle
} from 'reactNativeBasicComponents';

import {
  colors
} from '../general';

class Header extends React.PureComponent {
  render() {
    const {
      title,
      subtitle,
      icon,
      subtitleIcon,
      theme
    } = this.props;
    
    return (
      <View
        style={styles.container}
        elevation={4}
      >
        {
          typeof icon === 'object'
          ?
            <View style={styles.leftIconWrapper}>
              <Icon
                color={icon.color}
                name={icon.name}
                type={icon.type}
                size={icon.size}
              />
            </View>
          :
            null
        }
        <View style={styles.rightWrapper}>
          <Title
            text={title}
            style={styles.title}
          />
          <View
            style={styles.iconSubtitleWrapper}
          >
            <View style={styles.subtitleIconWrapper}>
              <Icon
                color={subtitleIcon.color}
                name={subtitleIcon.name}
                type={subtitleIcon.type}
                size={subtitleIcon.size}
              />
            </View>
            <SubTitle
              text={subtitle}
              style={styles.subtitle}
            />
          </View>
        </View>
      </View>
    )
  }
}

Header.defaultProps = {
  title: 'Chatbot Assistant',
  subtitle: 'online',
  icon: {
    name: 'robot',
    type: 'material-community',
    color: '#000000',
    size: 20
  },
  subtitleIcon: {
    name: 'circle',
    type: 'material-community',
    color: 'green',
    size: 12
  },
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    height: 64,
    flexDirection: 'row',
    padding: 12
  },
  leftIconWrapper: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightWrapper: {
    flex: 1,
  },
  title: {
    margin: 0,
    color: colors.headerTitleColor
  },
  iconSubtitleWrapper: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  subtitleIconWrapper: {
    marginRight: 8,
  },
  subtitle: {
    margin: 0,
    color: colors.headerSubTitleColor
  },
});


export default Header;