import Gumshoe from 'gumshoejs/dist/gumshoe.polyfills';
import axios from 'axios';

class trackerApp {
  constructor() {
    // Schema of user object
    this.user = {
      // Partition key = ip
      ip: '',
      userLocation: {
        city: '',
        state: '',
        country: '',
        zip: '',
        lat: '',
        long: '',
      },
      visits: [],
      divVisits: [],
      linksClicked: [],
    };

    this.apiURL = 'https://6f4q9idux4.execute-api.us-west-2.amazonaws.com/prod';

    this.axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  start() {
    // init gumshoe
    // eslint-disable-next-line
    const spy = new Gumshoe('#menu a', {
      offset: 200,
      nested: true,
    });
  }

  //
  // Api Calls
  //

  logUser = async () => {
    try {
      const res = await axios.post(`${this.apiURL}/logUser`);

      const user = res.data;

      return user;
    } catch (err) {
      console.log(err);
    }
  };
}

export default trackerApp;
