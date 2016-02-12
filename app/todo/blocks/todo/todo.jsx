"use strict"
import React, { Component, PropTypes } from "react";

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
      <div className="todo">
        <div className="todo__complete">
          <input
            type="checkbox"
            checked={ item.isComplete }
            onChange={ this._change.bind( this ) }
            disabled={ isPending }
          />
        </div>
        <div className="todo__text" style={ textStyle } >{ item.text }</div>
          <button
            className="todo__del"
            disabled={ isPending }
            onClick={ ev => this.props.delete( item.id ) }
          >x</button>

      </div>
    );
  }
}
