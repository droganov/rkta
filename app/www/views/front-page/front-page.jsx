"use strict"
import React, { Component } from "react";
import Helmet from "react-helmet";
import { Connect } from "racer-react";

class FrontPage extends Component {
  static statics = {
    racer: ( query, promise ) => {
      query( "test", {} ).fetchAs( "news" );
    }
  };

  _change( ev ){
    console.log( ev );
  }

  render() {
    return (
      <div className="FrontPage">
        <Helmet title="Home" />
        Hello
        <hr/>
        <textarea onChange={ this._change.bind( this ) } />
        { this.props.news.map( item => {
          return <div>ts: { item.ts }</div>
        })}
      </div>
    );
  }
}

export default Connect( FrontPage );
