import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const LinksVisited = ({ arrLength }) => {
  return (
    <div className="tracker__linksVisited">
      <List>
        <ListItem>asdf</ListItem>
      </List>
    </div>
  );
};

LinksVisited.defaultProps = {
  arrLength: 10,
};
export default LinksVisited;
