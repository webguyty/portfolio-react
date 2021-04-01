import React from 'react';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const DivsVisited = ({ divs, arrLength }) => {
  let divsMod = divs.slice(-arrLength).reverse();

  console.log(divsMod);
  return (
    <div className="tracker__divsVisited">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Div name</TableCell>
              <TableCell align="right">Time on Div (seconds)</TableCell>
              <TableCell align="right">Enter Time</TableCell>
              <TableCell align="right">Exit Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {divsMod.map(div => (
              <TableRow key={div.enterTime}>
                <TableCell component="th" scope="row">
                  {div.divName}
                </TableCell>
                <TableCell align="right">{div.timeOnDivSec}</TableCell>
                <TableCell align="right">{div.enterTime}</TableCell>
                <TableCell align="right">{div.exitTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* {divsMod.map(d => (
        <li>{JSON.stringify(d)}</li>
      ))} */}
    </div>
  );
};

DivsVisited.defaultProps = {
  arrLength: 10,
};

export default DivsVisited;
