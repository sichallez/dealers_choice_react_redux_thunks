import React, { Component } from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import axios from 'axios';
import Nav from './Nav';
import store, { fetchMuseums } from './store';
import MuseumPasses from './MuseumPasses';


class _App extends Component{
  componentDidMount(){
    this.props.bootstrap();
    window.addEventListener('hashchange', ()=> {
      this.props.setView(window.location.hash.slice(1));
    })
    this.props.setView(window.location.hash.slice(1));
  }
  render(){
    const { museums, view } = this.props;
    return (
      <div>
        <h1>Libary Museum Pass Reservation System</h1>
        <Nav />
        <MuseumPasses />
      </div>
    );
  }
}

const App = connect(
  state => state,
  (dispatch)=> {
    return {
      setView: (view)=> dispatch({ type: 'SET_VIEW', view }), 
      bootstrap: ()=> {
        dispatch(fetchMuseums());
      } 
    }
  }
)(_App);


render(<Provider store={ store }><App /></Provider>, document.querySelector('#root'));