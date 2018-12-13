import React from 'react'

import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity
} from 'react-native'

import {
  Loader,
  Icon
} from 'reactNativeBasicComponents'

import Generic from './Generic'

import {
  colors
} from '../general'

class Body extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isRefreshing: false,
      showJumpToBottom: false
    }

    this.dataRefresh = this.dataRefresh.bind(this)
  }

  dataRefresh () {
    this.setState({ isRefreshing: true })

    const {
      messageId
    } = this.props.messages[0] || {}

    this.props.fetchMessagesHistory(messageId)
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.isRefreshing && nextProps.messages.length > this.props.messages.length) {
      this.setState({ isRefreshing: false })
    }
  }

  scrollToBottom () {
    if (this.flatlist && !this.state.isRefreshing) {
      this.flatlist.scrollToEnd({ animated: true })
    }
  }

  _keyExtractor = (item, index) => item.messageId ? item.messageId.toString() : index.toString()

  _renderItem = ({ item, index }) => <Generic
    item={item}
    index={index}
    currentQuestion={this.props.currentQuestion}
    messages={this.props.messages}
    botMode={this.props.botMode}
    role={this.props.role}
    submitInputValue={this.props.submitInputValue}
  />

  onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      if (viewableItems[0].index < this.props.messages.length / 2) {
        this.setState({
          showJumpToBottom: true
        })
      } else {
        this.setState({
          showJumpToBottom: false
        })
      }
    }
  }

  onJumpIconPress () {
    this.scrollToBottom()
    this.setState({
      showJumpToBottom: false
    })
  }

  beginingReached (nativeEvent) {
    if (nativeEvent.contentOffset.y === 0) {
      this.dataRefresh()
    }
  }

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
                onContentSizeChange={() => this.onJumpIconPress()}
                onLayout={() => this.scrollToBottom()}
                ref={ref => {
                  this.flatlist = ref
                }}
                keyboardShouldPersistTaps='always'
                onViewableItemsChanged={this.onViewableItemsChanged}
                onScroll={({ nativeEvent }) => {
                  this.beginingReached(nativeEvent)
                }}
                scrollEventThrottle={0}
              />
            </View>
        }
        {
          this.state.showJumpToBottom
            ? <View style={styles.jumpIconContainer}>
              <TouchableOpacity
                onPress={() => this.scrollToBottom()}
              >
                <Icon
                  color={colors.primary}
                  name={'chevron-down-circle'}
                  type={'material-community'}
                  size={32}
                />
              </TouchableOpacity>
            </View>
            : null
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
  },
  jumpIconContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16
  }
})

export default Body
