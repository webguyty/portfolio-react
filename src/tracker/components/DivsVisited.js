import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const DivsVisited = ({ divs, arrLength }) => {
  let divsMod = divs.slice(-arrLength).reverse();

  return (
    <div className="tracker__divsVisited">
      {divsMod.map(d => (
        <li>{JSON.stringify(d)}</li>
      ))}
    </div>
  );
};

DivsVisited.defaultProps = {
  arrLength: 10,
};

export default DivsVisited;
