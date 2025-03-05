import { verifySession } from "./fetchApi";
import { Button, Component, getData, setData } from "./loveVanilla";

class LoginMenu extends Component {
  constructor(id, props) {
    super(id, props);

    this.loginOption = this.appendChild(new Component("#login-option"));
    this.logoutOption = this.appendChild(
      new Button("#logout-option").setClick((event) => {
        console.log("Logout option clicked");
        setData({
          session: {},
        });
      })
    );
  }

  async beforeRender() {
    super.beforeRender();
  }

  render() {
    super.render();

    const session = getData()?.session;

    if (session?.valid) {
      this.loginOption.hide();
      this.logoutOption.show();
    } else {
      this.loginOption.show();
      this.logoutOption.hide();
    }
  }

  async afterRender() {
    super.afterRender();
    await verifySession();
  }
}

export default LoginMenu;
