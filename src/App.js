import React, { Component } from 'react';
import './App.css';
import AppBar from './AppBar';
import LoginDialog from './LoginDialog';
import io from 'socket.io-client';
import qs from 'qs';
import url from 'url';

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {};
  }

  componentWillMount = () => {
    let query = qs.stringify({ nickname: window.sessionStorage.nickname });

    this.state.socket = window.socket = io.connect(`/?${query}`);
  }

  render() {
    return (
      <div className="App">
        <AppBar />
        {this.props.children}
        <LoginDialog />
      </div>
    );
  }
}

export default App;
