"use strict"

import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";
import { Connect } from "racer-react";
import q from "react-mixin-q"

import Form from "../../blocks/form/form";
import Todo from "../../blocks/todo/todo";

const App = React.createClass({
  mixins:[ q ],
  statics: {
    racer: function( query ){
      query( "todos", {} ).pipeAs( "todos" );
    }
  },
  createTodo: function( form ){
    const item = Object.assign( {}, form, { isComplete: false } )
    this.q.add( item );
    this.props.racerModel.add( "todos", item, err => this.q.del( item ) )
  },
  markComplete: function( todoID, isComplete ){
    this.props.racerModel.set( "todos." + todoID + ".isComplete", isComplete )
  },
  deleteTodo: function( todoID ){
    this.props.racerModel.del( "todos." + todoID )
  },
  render: function() {
    const { todos } = this.props
    return (
      <div className="App">
        <Helmet
          title="My Title"
          titleTemplate="rkta: %s"
        />
        <div className="App__header">Todos</div>
        <div className="App__content">
          { todos && todos.map( ( todo, i ) => {
            return <Todo
              key={ i }
              item={ todo }
              markComplete={ this.markComplete }
              delete={ this.deleteTodo }
            />
          })}
          { this.q.map( ( todo, i ) => {
            return <Todo
              key={ i }
              item={ todo }
              markComplete={ this.markComplete }
              delete={ this.deleteTodo }
              isPending={ true }
            />
          })}
        </div>
        <div className="App__footer">
          <Form onSubmit={ this.createTodo } />
        </div>
      </div>
    );
  }
});


// @q
// class App extends Component {
//   static statics = {
//     racer: query => query( "todos", {} ).pipeAs( "todos" )
//   };
//   createTodo( form ){
//     const item = Object.assign( {}, form, { isComplete: false } )
//     this.props.racerModel.add( "todos", item )
//   }
//   markComplete( todoID, isComplete ){
//     this.props.racerModel.set( "todos." + todoID + ".isComplete", isComplete )
//   }
//   deleteTodo( todoID ){
//     this.props.racerModel.del( "todos." + todoID )
//   }
//   render() {
//     const { todos } = this.props
//     return (
//       <div className="App">
//         <Helmet
//           title="My Title"
//           titleTemplate="rkta: %s"
//         />
//         <div className="App__header">Todos</div>
//         <div className="App__content">
//           { todos && todos.map( ( todo, i ) => {
//             return <Todo
//               key={ i }
//               item={ todo }
//               markComplete={ this.markComplete.bind( this ) }
//               delete={ this.deleteTodo.bind( this ) }
//             />
//           })}
//         </div>
//         <div className="App__footer">
//           <Form onSubmit={ this.createTodo.bind( this ) } />
//         </div>
//       </div>
//     );
//   }
// }


export default Connect( App );
