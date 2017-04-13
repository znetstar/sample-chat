import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route, Link, browserHistory, IndexRoute, IndexRedirect } from 'react-router';
import Messages from './Messages';
import Conversation from './Conversation';
import Conversations from './Conversations';
import NewConversation from './NewConversation';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class ThemedApp extends Component {
	constructor(props) {
	  super(props);
		
	  this.state = {};
	}

	render() {
		return (
			<MuiThemeProvider>
				<App children={this.props.children} />
			</MuiThemeProvider>
		);
	}
};

const Routes = (
	<Router history={browserHistory}>
		<Route path="/" component={ThemedApp}>
			<IndexRedirect to="/messages" />
			<Route path="messages" component={Conversations}/>
			<Route path="/messages/new" component={NewConversation}/>
			<Route path="/messages/:who" component={Conversation}/>
		</Route>
	</Router>
);

ReactDOM.render(
  Routes,
  document.getElementById('root')
);
