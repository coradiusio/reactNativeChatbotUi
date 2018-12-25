import React from 'react'

import {
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableOpacity
} from 'react-native'

import {
  ChatInput
} from 'reactNativeBasicComponents'

import {
  colors
} from '../../utils'

const ds = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1.id !== r2.id
})

export default class SearchableSelect extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      dataSource: ds.cloneWithRows([]),
      value: '',
      displayList: true
    }
    this.searchData = this.searchData.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.onInputCleared = this.onInputCleared.bind(this)
  }

  searchData (value) {
    const {
      searchKeyName
    } = this.props

    this.setState({ value }, () => {
      if (this.state.value.trim() === '') {
        this.onInputCleared()
      } else if (value.length >= this.props.minCharToSearch) {
        this.setState({
          isLoading: true,
          value: value
        })

        let refinedData = []

        if (searchKeyName) {
          refinedData = this.props.dataSource.filter(
            item => item.value[searchKeyName].toLowerCase().indexOf(value.trim().toLowerCase()) !== -1
          )
        } else {
          refinedData = this.props.dataSource.filter(
            item => item.value.toLowerCase().indexOf(value.trim().toLowerCase()) !== -1
          )
        }

        this.setState({
          isLoading: false,
          dataSource: ds.cloneWithRows(refinedData)
        })
      } else {
        this.setState({
          isLoading: true
        })
      }
    })
  }

  renderRow (item) {
    if (this.props.renderItemProps) {
      return (
        <TouchableOpacity
          onPress={() => this.onListItemClicked(item)}
        >
          {this.props.renderItemProps(item)}
        </TouchableOpacity>
      )
    }
    return null
  }

  renderSeparator () {
    return <View style={styles.listItemSeparator} />
  }

  onInputCleared () {
    this.setState({
      value: '',
      isLoading: false,
      dataSource: ds.cloneWithRows([])
    })
  }

  onListItemClicked (item) {
    const {
      searchKeyName
    } = this.props

    let result = ''

    if (searchKeyName) {
      result = item.value[searchKeyName]
    } else {
      result = item.value
    }

    if (typeof this.props.onSelect === 'function') {
      this.props.onSelect(result)
      this.setState({ displayList: false })
    }
  }

  render () {
    const element = []

    element.push(
      <ChatInput
        key={1}
        onChange={(value) => this.searchData(value)}
        inputText={this.state.value}
        onSubmitEditing={null}
        showLoader={this.state.isLoading}
        loaderColor={colors.primary}
        loaderSize='small'
      />
    )

    const listElement = (
      <View key={2} style={[styles.listContainerStyle, { height: this.props.listHeight, top: this.props.listOffset }]} elevation={1}>
        {
          this.state.dataSource._cachedRowCount === 0 && this.state.displayList && this.state.value !== '' && !this.state.isLoading
            ? <View style={styles.noItemFound}>
              <Text>{this.props.noItemFoundMessage || 'No Item Found'}</Text>
            </View>
            : <ListView
              enableEmptySections
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
              renderSeparator={this.renderSeparator}
              keyboardShouldPersistTaps='always'
            />
        }
      </View>
    )

    if (this.state.displayList && !this.state.isLoading && this.state.value !== '') {
      element.push(listElement)
    }

    return (
      <View style={styles.container}>
        {element}
      </View>
    )
  }
}

SearchableSelect.defaultProps = {
  listHeight: 150,
  listOffset: -158
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    zIndex: 2000
  },
  flexView: {
    flex: 1
  },
  progressiveInput: {
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  listContainerStyle: {
    backgroundColor: 'white',
    position: 'absolute',
    left: 0,
    right: 0
  },
  listItemSeparator: {
    borderWidth: 0.5,
    borderColor: '#CCCCCC'
  },
  iconContainerStyle: {
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  noItemFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
