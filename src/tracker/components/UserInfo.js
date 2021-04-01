import React from 'react';

const UserInfo = ({ title, info }) => {
  return (
    <div className="tracker__userInfo">
      <h5 className="tracker__userInfo__title">{title}</h5>
      <p className="tracker__userInfo__info">{info}</p>
    </div>
  );
};

export default UserInfo;
