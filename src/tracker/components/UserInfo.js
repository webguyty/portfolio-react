import React from 'react';

const UserInfo = ({ title, info }) => {
  return (
    <div className="userInfo">
      <p>title: {title}</p>
      <p>info: {info}</p>
    </div>
  );
};

export default UserInfo;
