import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css'
import './game.css'
import logo from "../logo.png"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouseChimney, faCircleQuestion, faShareNodes, faGear } from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";
import Cell from "./cell";

class EasyModeComponent extends React.Component{

    constructor(props) {
        super(props);
        this.gameKeyInput = this.gameKeyInput.bind(this);
        this.currentGuessRow = React.createRef();
        this.state = {
            error: null,
            isLoaded: false,
            model: null
        };
    }

    componentDidMount() {
        this.createGame();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.currentGuessRow.current != undefined &&  this.currentGuessRow.current != null) {
            this.currentGuessRow.current.firstChild.focus();
        }
    }

    createGame() {
        const url = 'http://150.230.127.93:8081/game';
        const postBody = {
            mode: "EASY"
        }
        const meta = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        }
        fetch(url, meta)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        gameId: result
                    })
                    this.getGame(result)
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    getGame(id) {
        const url = 'http://150.230.127.93:8081/game/' + id;
        const meta = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        fetch(url, meta)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        model: result
                    })
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    guess(id, guessExpression) {
        const url = 'http://150.230.127.93:8081/game/' + id + '/guess';
        const postBody = {
            expression: guessExpression
        }
        const meta = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postBody)
        }
        fetch(url, meta)
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    if (result.error) {
                        console.log(result.message)
                        alert(result.message)
                    } else {
                        this.setState({
                            model: result
                        })
                    }
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    gameKeyInput(e) {
        if (e.key === 'Enter') {
            //get guess expression
            console.log(e);
            let expression = "";
            const children = e.target.offsetParent.children;
            for (let i = 0; i < children.length - 2; i++) {
                const guessChar = children[i].textContent;
                //validate expression
                if (guessChar === '' || guessChar === undefined) {
                    window.alert("fill the blank!");
                    break;
                }
                expression += guessChar;
            }
            console.log(expression);
            //make a guess
            if (expression.length === children.length - 2 && !this.state.model.won && !this.state.model.lost) {
                this.guess(this.state.gameId, expression);
            }
        }
    }

    render() {

        const {error, isLoaded, model} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <div className= "container pb-5 pt-4 mx-auto" >
                        <div className="d-flex mw-100 w-50 mx-auto align-items-center pb-3 ps-5 pe-5">
                            <Link to="/"><img className="smallIcon" alt="logo" src={logo}/></Link>
                            <Link to="/" className="nav-btn pe-3" aria-label="Home">
                                <FontAwesomeIcon icon={faHouseChimney} size={"xl"}/>
                            </Link>
                            <button className="nav-btn pe-3" aria-label="Help" type="button" data-bs-toggle="modal" data-bs-target="ruleModal">
                                <FontAwesomeIcon icon={faCircleQuestion} size={"xl"}/>
                            </button>
                            <button className="nav-btn pe-3" aria-label="Share" type="button">
                                <FontAwesomeIcon icon={faShareNodes} size={"xl"} />
                            </button>
                            <button className="nav-btn" aria-label="Settings" type="button">
                                <FontAwesomeIcon icon={faGear} size={"xl"} />
                            </button>
                            <div className="d-flex flex-row flex-grow-1 text-start align-items-center">
                                <p className="ms-auto me-2"></p>
                                <span>
                                    <div className="numble-sub-name">
                                        easy
                                    </div>
                                    <div className="numble-name">
                                        numble
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div onKeyDown={this.gameKeyInput}>
                            {
                                model.cells.map((item, index) => {
                                    const entry = item.map(function (element, j) {
                                        return <Cell cell={element} mode={model.mode} currentGuess={model.numberOfGuessMade} won={model.won} key={j}/>
                                    });
                                    return (
                                        <div ref={index === model.numberOfGuessMade ? this.currentGuessRow : null} className="position-relative d-flex justify-content-center mb-1" key={index}>
                                            {entry}
                                            <div className="fixed-cell">
                                                =
                                            </div>
                                            <div className="fixed-cell">
                                                {model.rhs}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                    <footer className="App-Footer">
                        &copy; Numble Game &#183; Damon, Cornor, Berke <br/>
                        University of St Andrews
                    </footer>
                </div>
            );
        }
    }
}

export default EasyModeComponent;