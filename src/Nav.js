import React from 'react';
import { connect } from 'react-redux';

const Nav = ({ museums, view })=> {
  const available = museums.filter(museum => !museum.booked);
  const booked = museums.filter(museum => museum.booked);
  return (
    <nav>
      <a href='#' className={ !view ? 'selected': ''}>All Passes ({ museums.length })</a>
      <a href='#available' className={ view === 'available' ? 'selected': ''}>Available Passes ({ available.length})</a>
      <a href='#booked' className={ view === 'booked' ? 'selected': ''}>Booked Passes ({ booked.length })</a>
    </nav>
  );
};


export default connect(state => state )(Nav);