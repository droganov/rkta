var React = require( "react" );

module.exports = React.createClass({
  contextTypes: {
    racerModel: React.PropTypes.object.isRequired
  },
  propTypes: {
    children: React.PropTypes.element.isRequired
  },
  render: function() {
    return React.Children.only( this.props.children );
  }
});
