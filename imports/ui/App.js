import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js'

import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';


class App extends Component{

  constructor(props){
    super(props);
    this.state = {
      hideCompleted: false,
    }
  }

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

    // Tasks.insert({
    //   text,
    //   createdAt: new Date(),
    //   owner: Meteor.userId(),  // _id of logged in user
    //   username: Meteor.user().username,  // username of logged in user
    // });

    // al usar el metodo Meteor.call en el client side se hace uso de Optimistic UI
    // El client side envia un request al servidor como si se tratase de AJAX
    // Ocurre una simulacion q ocurre de manera directa en el cliente, este intenta predict la salida del servidor
    // Por tanto al crear una nueva tarea, esta va aparecer en la pantalla antes del resultado del servidor
    // Luego, si el resultado del servidor es diferente a la simulacion, solo se actualiza la UI, parchando el contenido de acuerdo al resultado del servidor.
    Meteor.call('task.insert',text);
    // limpiar el input field
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  toggleHideCompleted(){
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks(){
    let filteredTasks = this.props.tasks;
    if(this.state.hideCompleted){
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    // // se usas el prop task wraps con withTracker
    // return this.props.tasks.map((task) => (
    //   <Task key={task._id} task={task} />
    // ));
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render(){
    return (
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>

          <AccountsUIWrapper />

          {this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)}>
              <input
                type="text"
                ref="textInput"
                placeholder="Type to add new tasks"
              />
            </form> : ''
          }

        </header>
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  // se puede usar las tasks como prop
  // $ne es un operador de mongodb, el cual expresa q los documentos q no es igual a un valor, en este caso no igual a true, opera incluso para los documentos q no contienen el campo checked
  return {
    tasks: Tasks.find({},{sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true} }).count(),
    currentUser: Meteor.user(),
  }
})(App);
