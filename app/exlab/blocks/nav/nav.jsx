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
      if( this.props.children ){
         this.showDropdown();
         return ev.preventDefault();
      }
   }
   showDropdown(){
      if( !this.props.children ){
         return;
      }
      this.setState({
         showDropdown: true,
      })
   }
   render() {
      const className = classNames( "nav__link", this.props.className );
      return (
         <li className="nav__item">
            <Link
               activeClassName="nav__link--active"
               onClick={ this._onClick.bind( this ) }
               onTouchStart={ this._onClick.bind( this ) }
               onMouseOver={ this.showDropdown.bind( this ) }
               { ...this.props }
               className={ className }
               ref="link"
            >
               { this.props.name }
            </Link>
         </li>
      );
   }
}
