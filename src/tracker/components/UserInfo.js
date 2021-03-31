import React from 'react';

const UserInfo = ({ title, info }) => {
  return (
    <div className="userInfo">
      <h5 className="userInfo__title">{title}</h5>
      <p className="userInfo__info">{info}</p>
    </div>
  );
};

export default UserInfo;
