import React, { Component } from 'react';
import { Messages, Message } from './Messages';
import TextField from 'material-ui/TextField';
import SendIcon from 'material-ui/svg-icons/content/send';
import FlatButton from 'material-ui/FlatButton';
import Person from './Person';

class Conversation extends Component {
  constructor(props) {
    super(props);
  	
    let conversation = [];

    let who = props.params.who;

    this.state = { conversation, who };
  }

  componentWillMount = () => {
    window.socket.emit('see if the other person is typing', this.state.who);
    window.socket.on(`${this.state.who}:typing`, (typing) => {
      this.setState({ person_typing: typing });
    });
  }

  componentDidMount = () => {
    window.socket.emit('obtain conversation', this.state.who)
  }

  componentWillUnmount = () => {
    window.socket.emit('leave conversation', this.state.who)
    window.socket.emit("I don't care if the other person is typing", this.state.who)
  }

  sendMessage = () => {
    window.socket.emit('send message', {
      to: this.state.who,
      body: this.state.body,
      time: new Date()
    });
    
    this.setState({ body: '' })
  }

  setMessageBody = (_, body) => {
    window.socket.emit(`${window.sessionStorage.nickname}:typing`, true)

    if (this.state.typingTimeout)
      clearTimeout(this.state.typingTimeout);

    window.socket.emit(`typing`, true)
    var typingTimeout = setTimeout(() => {
      window.socket.emit(`typing`, false)
    }, 2000);

    this.setState({ typingTimeout, body })
  }

  render() {
    return (
      <div>
        <div style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'}}>
          <div style={{ marginLeft: 20, marginTop: 13, height: 28 }}>
            <Person who={this.state.who}/>
          </div>
        </div>
        <Messages messages={this.state.conversation} who={this.state.who} />
        <div className="space" style={{ marginTop: 30 }}></div>
        <div style={{ backgroundColor: 'white', bottom: 0, position: 'fixed', width: '98%', left: 0, marginLeft: 10, marginRight: 10 }}>
          <div style={{ color: 'rgba(0,0,0,.5)', marginTop: 5 }}>
            {this.state.person_typing ? <span>{this.state.who} is typing</span> : null}
          </div>
          <TextField value={this.state.body} fullWidth={false} style={{width: '70%'}} onChange={this.setMessageBody} />
          <FlatButton
            icon={<SendIcon />}
            onTouchTap={this.sendMessage}
            style={{ position: 'absolute', right: 2 }}
          />
        </div>
      </div>
    );
  }
}

export default Conversation;