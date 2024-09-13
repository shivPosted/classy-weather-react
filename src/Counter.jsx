import React from "react";

class Counter extends React.Component {
  constructor(props) {
    super(props);

    this.state = { count: 0 };
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  handleDecrement() {
    this.setState((cur) => {
      return { count: cur.count - 1 };
    });
  }

  handleIncrement() {
    this.setState((cur) => {
      return { count: cur.count + 1 };
    });
  }
  render() {
    const date = new Date(Date.now());
    date.setDate(date.getDay() + this.state.count);
    return (
      <div className="count">
        <button onClick={this.handleDecrement}>-</button>
        <span>{`${date.getDay() + "," + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear()}`}</span>
        <button onClick={this.handleIncrement}>+</button>
      </div>
    );
  }
}

export default Counter;
