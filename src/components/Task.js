import React from 'react';

export default class Task extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      content:this.props.content,
      completion:this.props.completion
    }
  }

  render() {
    return <span>{this.state.content}</span>
  }

}
