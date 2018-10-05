import React, { Component } from 'react';
import { ClickableMessages, Message } from './Messages';
import ComposeButton from './ComposeButton';
import './Conversations.css';

class Conversations extends Component {
  constructor(props) {
    super(props);
  	
    this.state = { conversations: [] };
  }

  componentDidMount() {
    window.socket.emit('obtain inbox');
    window.socket.on('update inbox', () => {
      window.socket.emit('obtain inbox');
    });
  }

  render() {
    return (
      <div>
        <ClickableMessages obtain_inbox={true} messages={this.state.conversations} />
        <ComposeButton />
      </div>
    );
  }
}

export default Conversations;