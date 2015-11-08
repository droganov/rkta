"use strict"
import React, { Component } from "react";
import { Link } from "react-router";
import classNames from "classnames";

export class Nav extends Component {
   render() {
      return (
         <nav className="nav">
            <ul className="nav__list">
               { this.props.children }
            </ul>
         </nav>
      );
   }
}

export class NavLink extends Component {
   _onClick( ev ){
      // if( this.pprops. )
      if( this.props.children ){
         // ev.preventDefault();
         console.log( Date.now() );
      }
      else{
         return;
      }
   }
   render() {
      const className = classNames( "nav__link", this.props.className );
      return (
         <li className="nav__item">
            <Link
               activeClassName="nav__link--active"
               onClick={ this._onClick.bind( this ) }
               onTouchStart={ this._onClick.bind( this ) }
               onMouseOver={ this._onClick.bind( this ) }
               { ...this.props }
               className={ className }
            >
               { this.props.name }
            </Link>
         </li>
      );
   }
}
