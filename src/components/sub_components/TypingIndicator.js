import React from 'react';

import {
  DotIndicator
} from 'reactNativeBasicComponents';

import ChatBubble from './ChatBubble';

class TypingIndicator extends React.PureComponent {
  render() {
    return (
      <ChatBubble float={this.props.float}>
        <DotIndicator color={this.props.color} size={10} count={3} />
      </ChatBubble>
    );
  }
}

export default TypingIndicator;