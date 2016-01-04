"use strict"
import React, { Component } from "react";

export default class Layout extends Component {
   render() {
      let { base, link, meta, script, title } = this.props.helmet;
      return (
         <html lang="en">
            <head>
               <meta charSet="utf-8" />
               <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
               <script src={ this.state.scriptName }></script>
               { base.toComponent() }
               { link.toComponent() }
               { meta.toComponent() }
               { script.toComponent() }
               { title.toComponent() }
            </head>
            <body>
               <div id="app" className="App" dangerouslySetInnerHTML={{ __html: this.props.markup }} />
            </body>
         </html>
      );
   }
}
