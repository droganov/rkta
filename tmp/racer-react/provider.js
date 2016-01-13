// inspired by https://github.com/rackt/react-redux/blob/master/src/components/Provider.js
var React = require( "react" );

module.exports = React.createClass({
  childContextTypes: {
    racerModel: React.PropTypes.object.isRequired
  },
  propTypes: {
    racerModel: React.PropTypes.object.isRequired,
    children: React.PropTypes.element.isRequired
  },
  getChildContext: function() {
    return {
      racerModel: this.props.racerModel
    };
  },
  render: function() {
    return React.Children.only( this.props.children );
  }
});
