import Component from "./loveVanilla/component";
import { getAppInfo } from "./fetchApi";
import { getData, setData } from "./loveVanilla/data";

class AppInfo extends Component {
  constructor(id) {
    super(id);
  }

  async init() {
    super.init();

    const appInfo = await getAppInfo();
    setData({ appInfo });
  }

  render() {
    const { appInfo } = getData();
    this.obj.innerHTML = `v${appInfo.app_version} • ${appInfo.app_version_date}`;
  }
}

export default AppInfo;