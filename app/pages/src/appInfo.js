import { Component, getData } from "./loveVanilla";

class AppInfo extends Component {
  render() {
    const { appInfo } = getData();
    if (!appInfo) {
      return;
    }
    this.setHtml(`v${appInfo.app_version} • ${appInfo.app_version_date}`);
  }
}

export default AppInfo;
