"use strict"
import React, { Component } from "react";
import Helmet from "react-helmet";
import { Connect } from "racer-react";

import Testblock from "../../blocks/testblock/testblock";

class FrontPage extends Component {
  static statics = {
    racer: query => {
      query( "test", {
        $orderby:{
          ts: -1,
        }
      }).pipeAs( "testList" );
      // }).fetchAs( "testList" );
    }
  };

  constructor(props,context) {
    super(props,context);
    this.state = {
      message: ""
    };
  }

  setMessage( message){
    this.setState({
      message: message,
    });
    this.refs.message.value = message;
  }
  _change( ev ){
    this.setMessage( ev.target.value );
  }

  _del( id ){
    this.props.racerModel.del( "test." + id );
  }

  _submit( ev ){
    ev.preventDefault();
    this.props.racerModel.add( "test", {
      ts: Date.now(),
      message: this.state.message,
    });
    this.setMessage( "" );
  }

  componentDidMount(){
    var self = this;
    this.interval = setInterval(()=>{self.tick()},1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  tick() {
    let s = this.state;
    let cnt = s.cnt || 0;
    this.setState({
      cnt: ++cnt
    });
  }

  render() {
    return (
      <div className="FrontPage">
        <Helmet title="Home" />
        Hello, my counter is { this.state.cnt }
        <hr/>
        <form onSubmit={ this._submit.bind( this ) }>
          <textarea ref="message" onChange={ this._change.bind( this ) } />
          <button disabled={ this.state.message === "" } >Add</button>
        </form>
        <ul style={{
            listStyleType: "none",
            margin: 0,
            padding: 0,
          }}>
          { this.props.testList.map( (item, i) => {
            return <li key={ i } style={{ marginBottom: "1em", }} >
              <div>
                <strong>{ item.message }</strong> — <span
                  onClick={ this._del.bind( this, item.id ) }
                  style={{ cursor: "pointer", }}
                  >×</span>
              </div>
              <small>{ item.ts }</small>
            </li>
          })}
        </ul>
      </div>
    );
  }
}

export default Connect( FrontPage );
