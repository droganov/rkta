import React, { Component } from "react"
import connectForm from "react-form-to-props"

class Form extends Component {
  _submit( ev ){
    ev.preventDefault()
    this.refs.form.reset()
    console.log( this.props.form );
  }
  render(){
    const todo = this.props.form && this.props.form.todo;
    return <form ref="form" className="form" onSubmit={ this._submit.bind( this ) }>
      <textarea valueLink={ this.props.bindAs( "todo" ) }></textarea>
      <button
        disabled={ !todo }
      >Add todo</button>
    </form>;
  }
}
export default connectForm( Form );
