import React, { Component } from 'react';
import './App.css';
import AppBar from './AppBar';
import LoginDialog from './LoginDialog';
import io from 'socket.io-client';
import qs from 'qs';

class App extends Component {
  constructor(props) {
    super(props);
  
    this.state = {};
  }

  componentWillMount = () => {
    let query_string = {
      nickname: window.sessionStorage.nickname || void(0)
    };

    this.state.socket = window.socket = io.connect(`sample-chat-server.projects.zacharyboyd.nyc/?${qs.stringify(query_string)}`)
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
