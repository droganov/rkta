"use strict"
import React, { Component } from "react";

import styles from "./preloader.styl"

export default () => {
  return (
    <div className={ styles.preloader }>
      <div className={ styles.spinner } />
    </div>
  )
}
