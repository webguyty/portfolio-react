import axios from 'axios';

const apiURL = 'https://ywhvk48wn5.execute-api.us-west-2.amazonaws.com/dev';

const config = {
  headers: {
    'Content-Type': 'application/json',
  },
};

export const logUser = async () => {
  try {
    const res = await axios.post(`${apiURL}/logUser`);

    const user = res.data;
    console.log(user);
    return user;
  } catch (err) {
    console.log(err);
  }
};

export const logDiv = async info => {
  try {
    const res = await axios.patch(`${apiURL}/logDiv`, info, config);

    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
};

export const logLink = async info => {
  try {
    const res = await axios.patch(`${apiURL}/logLink`, info, config);

    console.log(res.data);
  } catch (err) {
    console.log(err);
  }
};
