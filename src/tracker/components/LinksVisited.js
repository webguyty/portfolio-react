import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';

const LinksVisited = ({ links, arrLength }) => {
  links.length === 0
    ? (links = ['No links have been clicked on'])
    : (links = links.slice(-arrLength).reverse());

  return (
    <div className="tracker__linksVisited">
      <List component={Paper}>
        {links.map((l, i) => (
          <ListItem key={i}>{l}</ListItem>
        ))}
      </List>
    </div>
  );
};

LinksVisited.defaultProps = {
  arrLength: 10,
  links: [],
};
export default LinksVisited;
