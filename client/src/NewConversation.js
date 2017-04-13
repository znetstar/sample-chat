import React, { Component } from 'react';
import { Messages, Message } from './Messages';
import AutoComplete from 'material-ui/AutoComplete'
import './NewConversation.css';


class NewConversation extends Component {
  constructor(props) {
    super(props);
    
    let conversation = [];

    this.state = { conversation, who: null, people_search: [] };
  }

  doPeopleSearch = (partial_nickname) => {
    window.socket.emit('lookup person', partial_nickname, (people_search) => {
      this.setState({ people_search });
    });
  }

  setPerson = (nickname) => {
    window.location = `/messages/${nickname}`;
  }

  render() {
    return (
      <div style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'}}>
        <div style={{ marginLeft: 20, marginTop: 13 }}>
          <span style={{ color: 'rgba(0,0,0,.5)' }}>To</span>
          <span style={{ marginLeft: 50 }}>
            <AutoComplete hintText="Who do we want to send this to?" dataSource={this.state.people_search} onNewRequest={this.setPerson} onUpdateInput={this.doPeopleSearch} />
          </span>
        </div>
      </div>
    );
  }
}

export default NewConversation;