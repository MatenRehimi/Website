import React from 'react';
import firebase from '../Firebase';

class TaskList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type : this.props.type,
      tasks : {},
      newTask : ""
    }
  }

  async componentDidMount() {
    const tasks = await this.findTasks(this.state.type);
    console.log(tasks);
    this.setState({
      tasks:tasks
    })
  }

  async findTasks() {
    var val;
    //await is needed so val is not undefined
    await firebase.database().ref('calendar').child(this.state.type).child(this.props.props.year).child(this.props.props.month).child(this.props.props.day)
    .once("value", snapshot => {
      val = snapshot.val()
    })
    return val;
  }

  async removeTask(event) {
    event.persist();
    console.log(event.target.id);
    if(window.confirm('Are you sure you wish to delete this item?')) {
      await firebase.database().ref('calendar').child(this.state.type).child(this.props.props.year).child(this.props.props.month)
      .child(this.props.props.day).update({
        [event.target.id]:null
      })
      const copyOfTasks = {...this.state.tasks};
      delete copyOfTasks[event.target.id];
      this.setState({tasks:copyOfTasks});
      console.log("deleted");
    }else{
      console.log("not deleted");
    }
  }

  handleNewTaskChange(event) {
    this.setState({newTask:event.target.value});
  }

  async addTask(type,event) {
    if (event.key === "Enter") {
      if (this.state.newTask !== "") {
        console.log("task added")
        firebase.database().ref('calendar').child(this.state.type).child(this.props.props.year).child(this.props.props.month)
        .child(this.props.props.day).push(this.state.newTask)
        let temp = await this.findTasks(type)
        this.setState({newTask:"", tasks:temp});
      }else{
        alert("Please enter a task!");
      }
    }
  }

  render() {
    const tasks = this.state.tasks;
    if (tasks) {
      var shownTasks = [];
      for (var task in tasks) {
        shownTasks.push(<li key={task}> <input id={task} type="checkbox" name="list"
        onDoubleClick= {this.removeTask.bind(this)}/> {tasks[task]} </li>);
      }
    }
    return (
      <div className="position" id={this.props.position}>
        <h1>
          <center>{this.state.type}</center>
        </h1>
        <div className="inner-container">
          <ul>
            {shownTasks}
          </ul>
        </div>
          <center>
            <input className="inputForTask" type="text" name="task" size="40" autoComplete="off"
            onKeyDown={this.addTask.bind(this,"schedule")} value={this.state.newTask}
            onChange={this.handleNewTaskChange.bind(this)}/>
          </center>
      </div>
    );
  }
}

export default TaskList;
