import "./scss/main.scss";

import { BaseApp, UrlMatcher } from "./loveVanilla";

class Login extends BaseApp {}

console.log("INITIALIZING LOGIN");

const login = new Login();

login.start();
