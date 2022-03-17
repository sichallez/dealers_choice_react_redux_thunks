import React from 'react';

import { connect } from 'react-redux';
import { createMuseum, changeToBooked } from './store';

const _MuseumPasses = ({ museums, view, changeToBooked, create })=> {
  return (
    <div>
      <button onClick={ create }>Create A Random Pass!</button>
      <ul>
        {
          museums.filter(museum => !view || ( museum.booked && view === 'booked') ||( !museum.booked && view === 'available') ).map( museum => {
            return (
              <div>
                <input key={ museum.id } type="button" className={ museum.booked ? 'booked': ''}
    	            value={ museum.name }>
                </input>
                <button className={ museum.booked ? 'booked': 'button' } style={{width:"120px", height: "2rem", color:"#fff", boxShadow: "0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)"}} onClick={ () => changeToBooked(museum) }>Request Pass</button>
              </div>

            );
          })
        }
      </ul>
    </div>
  );
};

const mapDispatchToProps = (dispatch)=> {
  return {
    changeToBooked: (museum)=>{
      dispatch(changeToBooked(museum));
    }, 
    create: ()=>{
      dispatch(createMuseum());
    } 
  };
};

const MuseumPasses = connect(state => state, mapDispatchToProps)(_MuseumPasses);

export default MuseumPasses;