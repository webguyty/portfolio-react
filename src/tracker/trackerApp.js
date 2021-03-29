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
  }

  start() {
    const spy = new Gumshoe('#menu a', {
      offset: 200,
      nested: true,
    });

    // Log User information as soon user loads page

    document.addEventListener(
      'gumshoeActivate',
      e => {
        console.log(e.detail.content.id);
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
