import React from 'react'


const InfoItem = ({ title, info }) => {
  return (
    <li>
      <h5 className="tracker__userInfo__title">{title}</h5>
      <p className="tracker__userInfo__info">{info}</p>
    </li>
  );
}

export default InfoItem
