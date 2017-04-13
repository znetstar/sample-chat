import './led.css';
import React, {Component} from 'react';

class OnlineIndicator extends Component {
	constructor(props) {
	  super(props);

	  this.state = { who: props.who, online: false };
	}

	componentWillMount = () => {
		if (this.state.who !== window.sessionStorage.nickname) {
			window.socket.on(`${this.state.who}:online`, (online) => {
				this.setState({ online: online });
			});

			window.socket.emit('see if the other person is online', this.state.who);
		} else {
			window.socket.on('connect', () => {
				this.setState({ online: true })
			});

			window.socket.on('disconnect', () => {
				this.setState({ online: false })
			})

			if (window.socket.connected)
				this.setState({ online: true })
		}
	}

	componentWillUnmount() {
		if (this.state.who !== window.sessionStorage.nickname)
			window.socket.emit("I don't care if the other person is online", this.state.who);
	}

	render() {
		return (
			<div className={this.state.online ? 'led led-green' : 'led led-red'} />
		);
	}
};

class Person extends Component {
	constructor(props) {
	  super(props);
	  this.className = props.className;
	  this.state = { who: props.who };
	}

	render() {
		return (
			<span className={this.className} ><span>{this.state.who}</span> <span style={{ marginLeft: 5 }}><OnlineIndicator who={this.state.who} /></span></span>
		);
	}
};

export default Person;