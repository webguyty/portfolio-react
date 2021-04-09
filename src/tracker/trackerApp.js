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
      },
      visits: [],
      divVisits: [],
      linksClicked: [],
    };

    this.apiURL =
      'https://i3ob4hyw0g.execute-api.us-west-2.amazonaws.com/reactdev';
    this.axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // For logging stats of the divs visited in GumShoe
    this.divStats = {
      divName: '',
      enterTime: '',
      exitTime: '',
      divTime: '',
    };
  }

  start() {
    // init gumshoe
    // eslint-disable-next-line
    const spy = new Gumshoe('#menu a', {
      offset: 200,
      nested: true,
    });

    this.divStats.divName = 'header';
    let now = new Date();
    this.divStats.enterTime = now.toISOString();
  }

  //
  // Gumshoe - div and link tracking
  // Add event listeners to log div time with Gumshoe
  gsDivEnter() {
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
  }
  // When div becomes deactive on screen, deactivate Gumshoe
  gsDivExit() {
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

  // Event listeners for links
  linkListeners() {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
      link.addEventListener('click', e => {
        this.logLink({ link: link.href });
      });
    });
  }

  //
  // Api Calls
  //

  getUser = async () => {
    try {
      const res = await axios.get(`${this.apiURL}/user`);

      const user = res.data;
      return user;
    } catch (err) {
      console.log(err);
    }
  };

  getUserByIP = async ip => {
    try {
      const res = await axios.get(`${this.apiURL}/user/${ip}`);

      const user = res.data;
      return user;
    } catch (err) {
      console.log(err);
    }
  };

  logUser = async () => {
    try {
      const res = await axios.post(`${this.apiURL}/logUser`);

      const user = res.data;

      return user;
    } catch (err) {
      console.log(err);
    }
  };

  logDiv = async info => {
    try {
      await axios.patch(`${this.apiURL}/logDiv`, info, this.axiosConfig);

      // console.log(res.data);
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
