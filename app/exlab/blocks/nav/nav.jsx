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
   render() {
      const className = classNames( "nav__link", this.props.className );
      return (
         <li className="nav__item">
            <Link activeClassName="nav__link--active" { ...this.props } className={ className } >
               { this.props.children }
            </Link>
         </li>
      );
   }
}
