import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import SvgIcon from 'material-ui/SvgIcon';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import Person from './Person';
import './Messages.css';


const AccountIcon = (props) => (
	<SvgIcon {...props}>
		<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
		<path d="M0 0h24v24H0z" fill="none"/>
	</SvgIcon>
);

const avatarStyle = {
	height: 48,
	width: 48
};

class Message extends Component {
	constructor(props) {
	  super(props);

	  this.state = { clickable: props.clickable, id: props.id, who: props.who, body: props.body, time: (props.time) };
	}
	render() {
		return (
			<ListItem
				onClick={this.openMessage}
				leftAvatar={ (this.state.who !== window.sessionStorage.nickname) ? <AccountIcon style={avatarStyle} /> : null}
				rightAvatar={ (this.state.who === window.sessionStorage.nickname) ? <AccountIcon style={avatarStyle} /> : null}
				primaryText={this.state.body}
				secondaryText={moment(this.state.time).format('h:mma - MM/DD/YYYY')}
				className={(this.state.who === window.sessionStorage.nickname) ? 'message-right' : 'message-left'}
			/>
		);
	}
};

class ClickableMessage extends Component {
	constructor(props) {
	  super(props);

	  this.state = { obtain_inbox: props.obtain_inbox, from: props.from, clickable: props.clickable, id: props.id, who: props.who, body: props.body, time: (props.time) };
	}
	openMessage = () => {
		window.location = `/messages/${this.state.who}`;
	}
	render() {
		return (
			<ListItem
				onClick={this.openMessage}
				leftAvatar={<AccountIcon style={avatarStyle} />}
				primaryText={<Person who={this.state.who} />}
				secondaryText={
				<p>
				  <span style={{color: darkBlack}}>{`${(this.state.from === window.sessionStorage.nickname) ? 'You: ' : ''}${this.state.body}`}</span><br />
				  {moment(this.state.time).format('h:mma - MM/DD/YYYY')}
				</p>
				}
				secondaryTextLines={2}
			/>
		);
	}
};

class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = { obtain_inbox: props.obtain_inbox, who: (props.who || null), messages: (props.messages || []) };
  }

  componentWillMount = () => {
    window.socket.on('message sent', (message) => {
      let rendered_message = <Message id={message.id} key={message.key} who={window.sessionStorage.nickname} body={message.body} time={message.time} />
      
      let messages = [rendered_message].concat(this.state.messages);
      this.setState({ messages });
    });

    window.socket.on(`message from ${this.state.who}`, (message) => {
    	let rendered_message = (<Message id={message.id} key={message.key} who={message.from} body={message.body} time={message.time} />);
    	this.setState({ messages: (this.state.messages).concat(rendered_message) });
    });

    window.socket.on('load messages', (messages) => {
    	this.setState({ messages: messages.map((message) => { return (<Message id={message.id} key={message.key} who={message.from} body={message.body} time={message.time} />) }) });
    });

    window.socket.on('load inbox', (messages) => {
    	this.setState({ messages: messages.map((message) => { return (<ClickableMessage id={message.id} key={message.key} from={message.from} who={message.who} body={message.body} time={message.time} />) }) });
    });

    if (this.state.obtain_inbox)
    	window.socket.emit('obtain inbox');
  }

  render() {
  	return (
		<div>
			<List>{this.state.messages}</List>
		</div>
  	);
  }
}

class ClickableMessages extends Messages {
	constructor(props) {
	  super(props);
		
	  let messages = (props.messages || []);

	  this.state = { messages };
	}
}

export default Messages;
export { Messages, Message, ClickableMessages, ClickableMessage };