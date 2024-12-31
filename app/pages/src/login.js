import "./scss/main.scss";

import { BaseApp, UrlMatcher, Page } from "./loveVanilla";
import PageLogin from "./pageLogin";

class Login extends BaseApp {}

console.log("INITIALIZING LOGIN");

const login = new Login();

login.addPage(new PageLogin(login, new UrlMatcher("/login.html", "", "")));

login.start();
