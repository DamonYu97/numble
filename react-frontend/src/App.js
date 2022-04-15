import './App.css';
import logo from './logo.png'
import hard from './icons/hard.png'
import 'bootstrap/dist/css/bootstrap.min.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faFacebookF, faGithub} from "@fortawesome/free-brands-svg-icons";
import {Link} from "react-router-dom";

function App() {
  return (
    <div className="App">
        <div className="container py-2" id="content">
            <nav className="navbar pb-0">
                <div className="container-fluid">
                    <div className="navbar-brand navbar-expand-lg numble-name brand-name">
                        <img className="smallIcon" src={logo} alt="logo"/>
                        Numble
                    </div>
                    <ul className="navbar-nav flex-row">
                        <li className="nav-item me-1">
                            <a className="nav-link custom-btn btn-outline-dark" href="https://www.facebook.com/damonyu97">
                                <FontAwesomeIcon icon={faFacebookF} className="contactIcon"/>
                            </a>
                        </li>
                        <li>
                            <a className="nav-link custom-btn btn-outline-dark" href="https://github.com/DamonYuXXX/numble.git">
                                <FontAwesomeIcon icon={faGithub} className="contactIcon"/>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            <hr/>
            <div id="games" className="text-center">
                <h5 className="fw-bold">
                    Game Mode
                </h5>
                <div className="row justify-content-center">
                    <div className="col-5">
                        <Link className="d-flex flex-column align-items-center m-2" to="/easy">
                            <span className="numble-name mode-name">Easy</span>
                            <img className="bigIcon p-3" src={logo} alt="logo"/>
                        </Link>
                    </div>
                    <div className="col-5">
                        <a className="d-flex flex-column align-items-center m-2" href="/hard">
                            <span className="numble-name mode-name">Hard</span>
                            <img className="bigIcon p-3" src={hard} alt="hard"/>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <footer className="App-Footer">
            &copy; Numble Game &#183; Damon, Cornor, Berke <br/>
            University of St Andrews
        </footer>
    </div>
  );
}

export default App;
