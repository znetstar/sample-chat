import React, { Component } from 'react';
import './App.css';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Person from './Person';

class DropDown extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}



	render() {
		const changeNickname = () => {
			window.sessionStorage.removeItem('nickname');
			document.location = '/'
		};

		const goHome = () => {
			document.location = '/';
		};
		return (
			<IconMenu
			iconButtonElement={
			  <IconButton><MoreVertIcon /></IconButton>
			}
			targetOrigin={{horizontal: 'right', vertical: 'top'}}
			anchorOrigin={{horizontal: 'right', vertical: 'top'}}
			>
				<MenuItem onTouchTap={goHome} primaryText="Messages" />
				<MenuItem onTouchTap={changeNickname} primaryText="Change Nickname" />
			</IconMenu>
		);
	}
}

class MainAppBar extends Component {
  render() {
    return (
         <AppBar
          title={
          	<a href="/" style={{ textDecoration: 'none', color: 'white' }}>SampleChat</a>
          }
          iconElementRight={
          	<span>
          		{window.sessionStorage.nickname ? <Person className="app-bar-person" who={window.sessionStorage.nickname} /> : null}
          		<DropDown/>
          	</span>
          }
        />    
    );
  }
}

export default MainAppBar;