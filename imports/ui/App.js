import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js'

import Task from './Task.js';


class App extends Component{
  
  // getTasks(){
  //   return [
  //     {_id: 1, text: 'This is task 1'},
  //     {_id: 2, text: 'This is task 2'},
  //     {_id: 3, text: 'This is task 3'},
  //   ]
  // }

  handleSubmit(event){
    event.preventDefault();

    // busca el text field a traves de React.ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    Tasks.insert({
      text,
      createdAt: new Date()
    });

    // limpiar el input field
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderTasks(){
    // se usas el prop task wraps con withTracker
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render(){
    return (
      <div className="container">
        <header>
          <h1>Todo List</h1>

          <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
            />
          </form>

        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  // se puede usar las task como prop
  return {
    tasks: Tasks.find({},{sort: { createdAt: -1 } }).fetch(),
  }
})(App);