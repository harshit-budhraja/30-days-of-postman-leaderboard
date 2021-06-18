import * as React from 'react';
import classNames from 'classnames';
import Paper from '@material-ui/core/Paper';
import { CopyBlock, dracula } from "react-code-blocks";
import Leaderboard from './Leaderboard';
import {
    HashRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import logo from './assets/images/postman.jpg';
import badge from './assets/images/badge.png';
import './App.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetchingData: false
        };
    }

    handleFetchData = () => {
        this.setState({ isFetchingData: true });
    }

    handleDataFetched = () => {
        this.setState({ isFetchingData: false });
    }

    render() {
        const logoClassNames = classNames(
            'App-logo',
            { 'rotate': this.state.isFetchingData }
        );
        return (
            <Router>
                <Switch>
                    <Route exact path="/">
                        <div className="App">
                            <Paper className="App-header" elevation={3}>
                                <img className={logoClassNames} src={logo} alt='Postman Logo' />
                                <div className="App-header-menu">
                                    <a className="App-header-menu-navbtn" target="_self" href="https://postman.com">Home</a>
                                    <a className="App-header-menu-navbtn not-first" rel="noreferrer" target="_blank" href="https://www.postman.com/postman/workspace/30-days-of-postman-for-developers/overview">Challenge</a>
                                </div>
                            </Paper>
                            <div className="App-content">
                                <div className="App-container">
                                    <img className="image-centre badge" src={badge} alt="Challenge Badge" />
                                    <h2 className="App-container-title">Leaderboard 🏆</h2>
                                    <br/><br/>
                                    <p>
                                        It can also be embedded on HTML, Markdown etc. using the following iframe:
                                        <br/><br/>
                                        <CopyBlock
                                            language="js"
                                            text={`<iframe
    src="https://harshit-budhraja.github.io/30-days-of-postman-leaderboard/#/embed"
    title="Leaderboard Embed"
    width="800"
    height="500"
/>`                         }
                                            codeBlock
                                            theme={dracula}
                                            showLineNumbers={false}
                                        />
                                    </p>
                                </div>
                                <Leaderboard noembed={true} preFetch={this.handleFetchData} postFetch={this.handleDataFetched} refreshInterval={60 * 2} />
                            </div>
                        </div>
                    </Route>
                    <Route exact path="/embed">
                        <Leaderboard />
                    </Route>
                </Switch>
            </Router>
        );
    }
}
