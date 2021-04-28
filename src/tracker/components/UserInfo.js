import React from 'react';
import Grid from '@material-ui/core/Grid';

const UserInfoItem = ({ title, info }) => {
  return (
    <li>
      <h5 className="tracker__userInfo__title">{title}</h5>
      <p className="tracker__userInfo__info">{info}</p>
    </li>
  );
};

const UserInfo = (props) => {
  const {ip, country, state, city, zip} = props.user
  // console.log('asdf' + JSON.stringify(props.user));
  return (
    <div className="tracker__userInfo">
      <ul className="">
        <UserInfoItem title="User1" info={ip} />

        <UserInfoItem title="Country" info={country} />

        <UserInfoItem title="State" info={state} />

        <UserInfoItem title="City" info={city} />

        <UserInfoItem title="Zip" info={zip} />
      </ul>
    </div>
  );
};

export default UserInfo;
