import React from 'react';
import InfoItem from './InfoItem'



const UserInfo = (props) => {
  const {ip, country, state, city, zip} = props.user
  return (
    <div className="tracker__userInfo">
      <ul className="">
        <InfoItem title="User" info={ip} />

        <InfoItem title="Country" info={country} />

        <InfoItem title="State" info={state} />

        <InfoItem title="City" info={city} />

        <InfoItem title="Zip" info={zip} />
      </ul>
    </div>
  );
};

export default UserInfo;
