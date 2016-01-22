webpackHotUpdate(0,{

/***/ 231:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(79);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(80);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(81);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(83);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(82);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _react = __webpack_require__(4);

	var _react2 = _interopRequireDefault(_react);

	var _reactHelmet = __webpack_require__(94);

	var _reactHelmet2 = _interopRequireDefault(_reactHelmet);

	var _racerReact = __webpack_require__(148);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var FrontPage = function (_Component) {
	  (0, _inherits3.default)(FrontPage, _Component);

	  function FrontPage() {
	    var _Object$getPrototypeO;

	    var _temp, _this, _ret;

	    (0, _classCallCheck3.default)(this, FrontPage);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_Object$getPrototypeO = (0, _getPrototypeOf2.default)(FrontPage)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.state = { message: "", cnt: 0 }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
	  }
	  // }).fetchAs( "testList" );

	  (0, _createClass3.default)(FrontPage, [{
	    key: "setMessage",
	    value: function setMessage(message) {
	      this.setState({
	        message: message
	      });
	      this.refs.message.value = message;
	    }
	  }, {
	    key: "_change",
	    value: function _change(ev) {
	      this.setMessage(ev.target.value);
	    }
	  }, {
	    key: "_del",
	    value: function _del(id) {
	      this.props.racerModel.del("test." + id);
	    }
	  }, {
	    key: "_submit",
	    value: function _submit(ev) {
	      ev.preventDefault();
	      this.props.racerModel.add("test", {
	        ts: Date.now(),
	        message: this.state.message
	      });
	      this.setMessage("");
	    }
	  }, {
	    key: "componentDidMount",
	    value: function componentDidMount() {
	      var _this2 = this;

	      this.int = setInterval(function () {
	        _this2.setState({
	          cnt: _this2.state.cnt + 1
	        });
	      }, 1000);
	    }
	  }, {
	    key: "componentWillUnmount",
	    value: function componentWillUnmount() {
	      clearInterval(this.int);
	    }
	  }, {
	    key: "render",
	    value: function render() {
	      var _this3 = this;

	      return _react2.default.createElement(
	        "div",
	        { className: "FrontPage" },
	        _react2.default.createElement(_reactHelmet2.default, { title: "Home" }),
	        "Hi you ",
	        this.state.cnt && this.state.cnt,
	        _react2.default.createElement("hr", null),
	        _react2.default.createElement(
	          "form",
	          { onSubmit: this._submit.bind(this) },
	          _react2.default.createElement("textarea", { ref: "message", onChange: this._change.bind(this) }),
	          _react2.default.createElement(
	            "button",
	            { disabled: this.state.message === "" },
	            "Add"
	          )
	        ),
	        _react2.default.createElement(
	          "ul",
	          { style: {
	              listStyleType: "none",
	              margin: 0,
	              padding: 0
	            } },
	          this.props.testList.map(function (item, i) {
	            return _react2.default.createElement(
	              "li",
	              { key: i, style: { marginBottom: "1em" } },
	              _react2.default.createElement(
	                "div",
	                null,
	                _react2.default.createElement(
	                  "strong",
	                  null,
	                  item.message
	                ),
	                " — ",
	                _react2.default.createElement(
	                  "span",
	                  {
	                    onClick: _this3._del.bind(_this3, item.id),
	                    style: { cursor: "pointer" }
	                  },
	                  "×"
	                )
	              ),
	              _react2.default.createElement(
	                "small",
	                null,
	                item.ts
	              )
	            );
	          })
	        )
	      );
	    }
	  }]);
	  return FrontPage;
	}(_react.Component);

	FrontPage.statics = {
	  racer: function racer(query) {
	    // query( "test", {} ).fetchAs( "news" );
	    query("test", {
	      $orderby: {
	        ts: -1
	      }
	    }).pipeAs("testList");
	  }
	};
	exports.default = (0, _racerReact.Connect)(FrontPage);

/***/ }

})