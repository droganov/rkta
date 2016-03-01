"use strict"
import React, { Component, PropTypes } from "react";
import Preloader from "../preloader/preloader"

import styles from "./todo.styl"

export default class Todo extends Component {
  static propTypes = {
    markComplete: PropTypes.func.isRequired,
    delete: PropTypes.func.isRequired,
    isPending: PropTypes.bool,
  };
  static defaultProps = {
    isPending: false,
  };
  _change( ev ){
    this.props.markComplete( this.props.item.id, ev.target.checked )
  }
  render() {
    const { item, isPending } = this.props;
    let textStyle = {
      width: "100%"
    }
    if( item.isComplete ){
      Object.assign( textStyle, { textDecoration: "line-through" });
    }
    else{
      Object.assign( textStyle, { fontWeight: "normal" });
    }
    return (
      <div className={ styles.todo } style={{
          marginBottom:"1px",
        }}>
        <div style={{
            width: 24,
            height: 24,
            position: "relative",
          }}>
          { !isPending && <input
            type="checkbox"
            checked={ item.isComplete }
            onChange={ this._change.bind( this ) }
            disabled={ isPending }
          />}
          { isPending && <Preloader/> }
        </div>
        <div className={ styles.text } style={ textStyle } >{ item.text }</div>
          <button
            className="todo__del"
            disabled={ isPending }
            onClick={ ev => this.props.delete( item.id ) }
            style={{
              width: 24,
              height: 24,
              padding: 0,
              border: 0,
            }}
          >x</button>

      </div>
    );
  }
}
