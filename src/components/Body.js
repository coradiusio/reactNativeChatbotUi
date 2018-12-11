import React from 'react'

import {
  StyleSheet,
  View,
  FlatList
} from 'react-native'

import {
  Loader
} from 'reactNativeBasicComponents'

import Generic from './Generic'

import {
  colors
} from '../general'

class Body extends React.PureComponent {
  scrollToBottom () {
    if (this.flatlist) {
      this.flatlist.scrollToEnd({ animated: true })
    }
  }

  _keyExtractor = (item, index) => item.message_id ? item.message_id.toString() : index.toString()

  _renderItem = ({ item, index }) => <Generic
    item={item}
    index={index}
    currentQuestion={this.props.currentQuestion}
    messages={this.props.messages}
    botMode={this.props.botMode}
    role={this.props.role}
    submitInputValue={this.props.submitInputValue}
  />

  render () {
    const {
      messages,
      loader
    } = this.props

    return (
      <View style={styles.flexView}>
        {
          this.props.noMessageAvailable
            ? <Loader color={loader.color} size={'large'} />
            : <View style={styles.flexView}>
              <FlatList
                data={messages}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                style={[StyleSheet.absoluteFill, styles.container]}
                contentContainerStyle={styles.flatlistContentContainer}
                onContentSizeChange={() => this.scrollToBottom()}
                onLayout={() => this.scrollToBottom()}
                ref={ref => {
                  this.flatlist = ref
                }}
                keyboardShouldPersistTaps='always'
              />
            </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  flexView: {
    flex: 1
  },
  leftChatText: {
    color: colors.leftChatText
  },
  rightChatText: {
    color: colors.rightChatText
  },
  minWidth: {
    minWidth: '25%'
  },
  rightChatTextRightText: {
    alignSelf: 'flex-start'
  },
  flexDirectionRow: {
    flexDirection: 'row'
  },
  timeString: {
    fontSize: 10
  },
  timeContainer: {
    alignItems: 'flex-end'
  },
  timeEditContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  },
  leftTypingContainer: {
    height: 40
  },
  rightTypingContainer: {
    height: 68
  },
  imageContainer: {
    width: 270,
    height: 270
  },
  image: {
    flex: 1,
    width: null,
    height: null
  },
  verticalSpacing: {
    flex: 1,
    height: 4
  },
  flatlistContentContainer: {
    padding: 8
  }
})

export default Body
