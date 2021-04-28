import React, {Fragment} from 'react'


const InfoItem = ({ title, info }) => {
  return (
    <Fragment>
      <h5 className="tracker__userInfo__title">{title}</h5>
      <p className="tracker__userInfo__info">{info}</p>
    </Fragment>
  );
}

export default InfoItem
