import React from 'react';
import InfoItem from './InfoItem'



const UserInfo = (props) => {
  const {ip, country, state, city, zip} = props.user
  return (
    <div className="tracker__userInfo">
      <ul className="">
        <li><InfoItem title="User" info={ip} /></li>

        <li><InfoItem title="Country" info={country} /></li>

        <li><InfoItem title="State" info={state} /></li>

        <li><InfoItem title="City" info={city} /></li>

        <li><InfoItem title="Zip" info={zip} /></li>
      </ul>
    </div>
  );
};

export default UserInfo;
