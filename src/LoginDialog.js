import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';


export default class LoginDialog extends React.Component {
  state = {
    open: false,
  };

  componentDidMount() {
    window.socket.once('obtain nickname', () => {
      this.handleOpen();
    });
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  setNickname = () => {
    window.socket.emit('set nickname', this.state.nickname);
    window.sessionStorage.nickname = this.state.nickname;

    this.handleClose();
    
    window.location.reload();
  }

  nicknameChange = (_, nickname) => {
    this.setState({ nickname })
  }

  render() {
    const actions = [
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.setNickname}
      />,
    ];

    return (
      <div>
        <Dialog
          title="Set Nickname"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Please provide SampleChat with a nickname
          <br/>
          <TextField onChange={this.nicknameChange} hintText="MickeyMouse" />
        </Dialog>
      </div>
    );
  }
}