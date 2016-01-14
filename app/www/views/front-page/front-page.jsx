"use strict"
import React, { Component } from "react";
import Helmet from "react-helmet";

export default class FrontPage extends Component {
  static statics = {
    racerQueries: {
      one: "query",
    }
  };

  static contextTypes = {
    racerModel: React.PropTypes.object.isRequired,
  };

  constructor( props, context ) {
    super(props, context);
    const racerModel = props.racerModel || context.racerModel;
    this.racerModel = racerModel;
    this.state = {};
  }

  componentDidMount() {
    let self = this;
    var $test = this.racerModel.query("test", {
      $orderby: {
        ts: -1
      },
      $limit: 3
    });
    $test.subscribe((err)=>{
      if(err) return console.log(err);
      self.getList($test);
      self.racerModel.on("all", "$queries."+$test.hash+".*", self.getList.bind(self,$test));
    });

  }
  getList($q) {
    let list = $q.get();
    this.setState({
      list: list
    });
  }
  dateFormat(item){
    let dt = new Date(item.ts);
    return dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds() + " " + dt.getDate() + "." + dt.getMonth() + "." + dt.getFullYear()
  }
  addTs() {
    this.racerModel.add("test", {ts:Date.now()});
  }
  render() {
    let listNotEmpty = this.state.list&&(this.state.list.length>0);
    return (
      <div className="FrontPage">
        <Helmet title="Home" />
        Hello
        {listNotEmpty?
          <div className="FrontPage__listing">
            {this.state.list.map((item,inx)=>{
              return (
                <div className="FrontPage__listing-item" key={"item_"+inx}>
                  {this.dateFormat(item)}
                </div>
              );
            })}
          </div>
        :null}
        <div className="FrontPage__actions">
          <button onClick={this.addTs.bind(this)}>Добавить время</button>
        </div>
      </div>
    );
  }
}
