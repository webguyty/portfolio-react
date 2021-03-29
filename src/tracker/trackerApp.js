import Gumshoe from 'gumshoejs/dist/gumshoe.polyfills';
import axios from 'axios';

class trackerApp {
  constructor() {
    this.user = 'a user';

    this.apiURL = 'https://ywhvk48wn5.execute-api.us-west-2.amazonaws.com/dev';
    this.axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // For logging stats of the divs visited
    this.divStats = {
      divName: '',
      enterTime: '',
      exitTime: '',
      divTime: '',
    };
  }

  start() {
    const spy = new Gumshoe('#menu a', {
      offset: 200,
      nested: true,
    });

    // Log User information as soon user loads page

    this.gsDivListeners();
    // document.addEventListener(
    //   'gumshoeActivate',
    //   e => {
    //     console.log(e.detail.content.id);
    //   },
    //   false
    // );
  }

  gsDivListeners() {
    // When div becomes active on screen, activate Gumshoe
    document.addEventListener(
      'gumshoeActivate',
      event => {
        // Div name
        const divID = event.detail.content.id;
        this.divStats.divName = divID;

        // Div enter time
        let now = new Date();
        this.divStats.enterTime = now.toISOString();
      },
      false
    );

    // When div becomes deactive on screen, deactivate Gumshoe
    document.addEventListener(
      'gumshoeDeactivate',
      event => {
        const divID = event.detail.content.id;
        let now = new Date();
        now = now.toISOString();

        // If things are are working correctly give exit time
        if (divID === this.divStats.divName) {
          // Div exit time
          this.divStats.exitTime = now;
        } else {
          // Create a this.divStats object that had to result from page reload or some type of error
          this.divStats.divName = `${divID} - page reloaded`;
          this.divStats.enterTime = now;
          this.divStats.exitTime = now;
        }

        this.logDiv(this.divStats);

        this.divStats = {};
      },
      false
    );
  }

  //
  // Api Calls
  //

  logUser = async () => {
    try {
      const res = await axios.post(`${this.apiURL}/logUser`);

      const user = res.data;
      console.log(user);
      return user;
    } catch (err) {
      console.log(err);
    }
  };

  logDiv = async info => {
    try {
      const res = await axios.patch(
        `${this.apiURL}/logDiv`,
        info,
        this.axiosConfig
      );

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  logLink = async info => {
    try {
      const res = await axios.patch(
        `${this.apiURL}/logLink`,
        info,
        this.axiosConfig
      );

      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };
}

export default trackerApp;
