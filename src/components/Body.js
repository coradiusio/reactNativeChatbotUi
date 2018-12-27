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
} from '../utils'

let timer

class Body extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      showJumpToBottom: false,
      isDataRefreshingForcefully: false,
      isDataRefreshingNormally: false
    }

    this.dataRefreshForcefully = this.dataRefreshForcefully.bind(this)
    this.dataForcefullyRefreshed = this.dataForcefullyRefreshed.bind(this)
    this.dataRefreshNormally = this.dataRefreshNormally.bind(this)
    this.dataNormallyRefreshed = this.dataNormallyRefreshed.bind(this)
  }

  dataForcefullyRefreshed () {
    timer = setTimeout(() => {
      this.setState({ isDataRefreshingForcefully: false })
    }, 1000)
  }

  dataRefreshForcefully () {
    if (!this.state.isDataRefreshingForcefully) {
      this.setState({
        isDataRefreshingForcefully: true
      })

      const {
        messageId
      } = this.props.messages[0] || {}

      this.props.fetchMessagesHistory(messageId, this.dataForcefullyRefreshed)
    }
  }

  dataNormallyRefreshed () {
    timer = setTimeout(() => {
      this.setState({ isDataRefreshingNormally: false })
    }, 1000)
  }

  dataRefreshNormally () {
    if (!this.state.isDataRefreshingNormally) {
      this.setState({
        isDataRefreshingNormally: true
      })

      const {
        messageId
      } = this.props.messages[0] || {}

      this.props.fetchMessagesHistory(messageId, this.dataNormallyRefreshed)
    }
  }

  scrollToBottom () {
    if (this.flatlist && !this.state.isDataRefreshingForcefully && !this.state.isDataRefreshingNormally) {
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
    handleEditPress={this.props.handleEditPress}
    handleFinishedEdit={this.props.handleFinishedEdit}
    handleRadioButton={this.props.handleRadioButton}
    isEditingMode={this.props.isEditingMode}
    currentEditingMessageId={this.props.currentEditingMessageId}
    currentEditingAnswerOptionsMessageId={this.props.currentEditingAnswerOptionsMessageId}
  />

  onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const lastMessage = viewableItems[viewableItems.length - 1]
      if (!lastMessage.isViewable && lastMessage.index < Math.round((Math.floor(this.props.messages.length - 1) / 1.33))) {
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

  reachingTop (nativeEvent) {
    if (!this.state.isDataRefreshingForcefully && !this.state.isDataRefreshingNormally) {
      if (nativeEvent.contentOffset.y === 0) {
        this.dataRefreshForcefully()
      } else if (nativeEvent.contentOffset.y > 0 && (nativeEvent.contentOffset.y / nativeEvent.contentSize.height) < 0.3) {
        this.dataRefreshNormally()
      }
    }
  }

  componentWillUnmount () {
    if (timer) {
      clearTimeout(timer)
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
              {
                this.state.isDataRefreshingForcefully
                  ? <View style={styles.loaderContainer}>
                    <Loader color={loader.color} size={'small'} />
                  </View>
                  : null
              }
              <View style={styles.flexView}>
                <FlatList
                  data={messages}
                  keyExtractor={this._keyExtractor}
                  renderItem={this._renderItem}
                  style={[StyleSheet.absoluteFill, styles.container]}
                  contentContainerStyle={styles.flatlistContentContainer}
                  onContentSizeChange={() => this.scrollToBottom()}
                  onViewableItemsChanged={this.onViewableItemsChanged}
                  ref={ref => {
                    this.flatlist = ref
                  }}
                  keyboardShouldPersistTaps='always'
                  // onScroll={({ nativeEvent }) => {
                  //   this.reachingTop(nativeEvent)
                  // }}
                  scrollEventThrottle={0}
                  removeClippedSubviews
                  maxToRenderPerBatch={20}
                  initialNumToRender={20}
                />
              </View>
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
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    height: 48,
    zIndex: 1000,
    backgroundColor: 'rgba(255,255,255,0.8)'
  }
})

export default Body
