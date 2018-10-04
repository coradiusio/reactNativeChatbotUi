import React from 'react';

import _ from 'lodash';

import Search from '../modules/Search/Search';

class SearchSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      results: [],
      value: '',
      source: [],
    }
  }

  componentDidMount() {
    this.setState({
      source: this.props.source || []
    })
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' });

  handleResultSelect = (e, { result }) => {
    this.setState({ value: result.title });
    this.props.onSelect(result.value, result.title, 'searchselect');
  }

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      const re = new RegExp(_.escapeRegExp(this.state.value), 'i');
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(this.state.source, isMatch),
      })
    }, 300);
  }

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <Search
        loading={isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })}
        results={results}
        minCharacters={this.props.minCharacters || 3}
        value={value}
        fluid
        input={{ fluid: true, placeholder: this.props.placeholder || '' }}
      />
    );
  }
}

export default SearchSelect;