"use strict"

import React, { Component } from "react";
import Helmet from "react-helmet";
import { Link } from "react-router";
import { connectRacer } from "racer-react";
import q from "react-mixin-q"

import Form from "../../blocks/form/form";
import Todo from "../../blocks/todo/todo";

import styles from "./app.styl"

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
    this.props.racerModel.root.add( "todos", item, err => this.q.del( item ) )
  },
  markComplete: function( todoID, isComplete ){
    this.props.racerModel.root.set( "todos." + todoID + ".isComplete", isComplete )
  },
  deleteTodo: function( todoID ){
    this.props.racerModel.root.del( "todos." + todoID )
  },
  render: function() {
    const { todos } = this.props
    return (
      <div className={ styles.app }>
        <Helmet
          title="My Title"
          titleTemplate="rkta: %s"
        />
      <div className={ styles.header }>Todos</div>
        <div className={ styles.content }>
          { todos.map( ( todo, i ) => {
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
        <div>
          <Form onSubmit={ this.createTodo } />
        </div>
      </div>
    );
  }
});

export default connectRacer( App );
