import React from 'react'

import {
  View,
  Modal as RNModal,
  Text,
  ActivityIndicator,
  StyleSheet
} from 'react-native'

import Modal from 'modal-react-native-web'

import {
  colors
} from '../../utils'

import {
  platform
} from '../../general'

class Progress extends React.PureComponent {
  wrapper (component) {
    if (platform === 'web') {
      return (
        <Modal onDismiss={() => null} visible={this.props.visible} transparent>
          {component}
        </Modal>
      )
    }
    return (
      <RNModal onRequestClose={() => null} visible={this.props.visible} transparent>
        {component}
      </RNModal>
    )
  }

  render () {
    const element = (
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <ActivityIndicator size='large' color={colors.primary} />
          <Text style={styles.text}>{this.props.text || 'Please Wait'}</Text>
        </View>
      </View>
    )
    return this.wrapper(element)
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  innerContainer: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 20,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  text: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '200'
  }
})

export default Progress
