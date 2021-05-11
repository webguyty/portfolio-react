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

  if (!divs)
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Div name</TableCell>
              <TableCell align="right">Time on Div (seconds)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">
                No Div's visited
              </TableCell>
              <TableCell align="right">0.0</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );

  return (
    <div className="tracker__divsVisited">
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Div name</TableCell>
              <TableCell align="right">Time on Div (seconds)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {divsMod.map((div, i) => (
              <TableRow key={i}>
                <TableCell>{div.divName}</TableCell>
                <TableCell align="right">{div.timeOnDivSec}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

DivsVisited.defaultProps = {
  arrLength: 10,
};

export default DivsVisited;
