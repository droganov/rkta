import React, { Component } from 'react';

import styles from './form.styl';

class Form extends Component {
  static propTypes = {
    onCreate: React.PropTypes.func.isRequired,
  };
  state = {
    text: '',
    isComplete: false,
  };
  change = (event) => {
    this.setState({ text: event.target.value });
  }
  submit = (ev) => {
    ev.preventDefault();
    this.props.onCreate(this.state);
    this.setState({ text: '' });
  }
  render() {
    const { text } = this.state;
    return (
      <form ref="form" className={styles.form} onSubmit={this.submit}>
        <textarea
          className={styles.field}
          value={text}
          onChange={this.change}
        ></textarea>
        <button
          className={styles.control}
          disabled={!text}
        >Add todo</button>
      </form>
    );
  }
}
export default Form;
