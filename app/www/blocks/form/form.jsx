import React, { Component } from "react"
import connectForm from "react-form-to-props"

class Form extends Component {
  _submit( ev ){
    ev.preventDefault()
    console.log( this.props.loginForm );
  }
  render(){
    return <form onSubmit={ this._submit.bind( this ) }>
      <input type="text" valueLink={ this.props.bindAs( "login", "loginForm" ) } />
      <input type="password" valueLink={ this.props.bindAs( "password", "loginForm" ) } />
      <label>
        <input type="checkbox" checkedLink={ this.props.bindAs( "remember", "loginForm" ) } />
        Keep me signed in
      </label>
      <button>Submit</button>
    </form>;
  }
}
export default connectForm( Form );
