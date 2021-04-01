import React from 'react';

const DivsVisited = ({ divs, divLength }) => {
  let divsShort = divs.slice(-divLength);

  return (
    <div className="tracker__divsVisited">
      {divsShort.map(d => (
        <li>{JSON.stringify(d)}</li>
      ))}
    </div>
  );
};

DivsVisited.defaultProps = {
  divLength: 10,
};

export default DivsVisited;
