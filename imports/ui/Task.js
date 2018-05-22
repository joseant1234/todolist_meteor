import React, { Component } from 'react';

export default class Task extends Component{
  
  constructor(props){
  	super(props);
  }

  render(){
    return (
      <li>{this.props.task.text}</li>
    )
  }
}