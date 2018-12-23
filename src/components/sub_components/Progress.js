import React from 'react'

import {
  View,
  Modal,
  Text,
  ActivityIndicator,
  StyleSheet
} from 'react-native'

import {
  colors
} from '../../utils'

class Progress extends React.PureComponent {
  render () {
    return (
      <Modal onRequestClose={() => null} visible={this.props.visible} transparent>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <ActivityIndicator size='large' color={colors.primary} />
            <Text style={styles.text}>Please Wait</Text>
          </View>
        </View>
      </Modal>
    )
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
