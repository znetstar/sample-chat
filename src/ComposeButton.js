import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

class ComposeButton extends Component {
  constructor(props) {
    super(props);

    this.state = { };
  }

  createMessage = () => {
    window.location = '/messages/new';
  }

  render() {
    let style = {
      position: 'fixed',
      bottom: 40,
      right: 40
    }; 

    return (
      <FloatingActionButton onTouchTap={this.createMessage} style={style}>
        <ContentAdd />
      </FloatingActionButton>
    );
  }
}

export default ComposeButton;