import React from 'react';

import {
  StyleSheet,
  View
} from 'react-native';

import {
  colors
} from '../../general';

class TalkBubble extends React.Component {
  render() {
    const float = this.props.float;
    return (
      <View
        style={[
          styles.chatBubble,
          styles[`chatBubble${float}`],
          float === 'right' ? styles.rightSpecialStyling : null,
        ]}
      >
        {this.props.children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatBubble: {
    maxWidth: '85%',
    padding: 8,
    position: 'relative',
    borderRadius: 4,
    marginBottom: 4,
  },
  chatBubbleleft: {
    backgroundColor: colors.leftChatBackground,
    borderTopLeftRadius: 0,
    paddingRight: 16,
  },
  chatBubbleright: {
    backgroundColor: colors.rightChatBackground,
    borderTopRightRadius: 0,
    paddingLeft: 16,
  },
  rightSpecialStyling: {
    marginTop: 12,
    marginBottom: 16
  },
});

export default TalkBubble;