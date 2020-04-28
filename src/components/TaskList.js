import React from 'react';
import firebase from '../Firebase';

class TaskList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type : this.props.type,
      tasks : {},
      dictionaryOfTasks: {},
      newTask : ""
    }
  }

  async componentDidMount() {
    await this.findTasks(this.state.type);
  }

  async findTasks() {
    //await is needed so val is not undefined
    await firebase.database().ref(this.state.type).child("tasks").child(this.props.props.year).child(this.props.props.month).child(this.props.props.day)
    .once("value", snapshot => {
      if (snapshot.exists()) {
        this.setState({
          tasks:Object.keys(snapshot.val()),
          dictionaryOfTasks:snapshot.val()
        })
      }
    })
  }

  async removeTask(event) {
    event.persist();
    if(window.confirm('Are you sure you wish to delete this item?')) {
      await firebase.database().ref(this.state.type).child("tasks").child(this.props.props.year).child(this.props.props.month)
      .child(this.props.props.day).update({
        [this.state.tasks[event.target.id]]:null
      })
      const copyOfTasks = {...this.state.tasks};
      delete copyOfTasks[event.target.id];
      this.setState({tasks:copyOfTasks});
      console.log("deleted");
    }else{
      console.log("not deleted");
    }
  }

  handleNewTaskChange (event) {
    this.setState({newTask:event.target.value});
  }

  async handleClick(event){
    let check = "incomplete";
    if (event.target.checked) {
      check = "complete"
    }
    await firebase.database().ref(this.state.type).child("tasks").child(this.props.props.year).child(this.props.props.month)
    .child(this.props.props.day).update({
      [this.state.tasks[event.target.id]]:check
    })
  }

  async addTask(type,event) {
    if (event.key === "Enter") {
      if (this.state.newTask !== "") {
        console.log("task added")
        console.log(this.state.newTask)
        let {type,newTask} = this.state
        firebase.database().ref(type).child("tasks").child(this.props.props.year).child(this.props.props.month)
        .child(this.props.props.day).child(newTask).set("incomplete")
        await this.findTasks(type)
        let {tasks} = this.state;
        this.setState({newTask:"", tasks:tasks});
      }else{
        alert("Please enter a task!");
      }
    }
  }

  async getOptionPicked(event) {
    firebase.database().ref(this.state.type).child("dayRating").child(this.props.props.year).child(this.props.props.month)
    .child(this.props.props.day).set(event.target.value)
  }

  render() {
    const {tasks,dictionaryOfTasks} = this.state;
    if (tasks) {
      var shownTasks = [];
      for (var task in tasks) {
        shownTasks.push(<li key={task}> <input id={task} type="checkbox"
        defaultChecked={String("complete") === dictionaryOfTasks[tasks[task]]} onChange={()=>{}}
        name="list" onDoubleClick= {this.removeTask.bind(this)} onClick={this.handleClick.bind(this)}/>
        {tasks[task]} </li>);
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
            <div onChange={this.getOptionPicked.bind(this)}>
              <input className="firstOption" type="radio" name="pick" value="firstOption"/><b style={{color:"black"}}>x</b>
              <input className="secondOption" type="radio" name="pick" value="secondOption"/><b style={{color:"red"}}>x</b>
              <input className="thirdOption" type="radio" name="pick" value="thirdOption"/><label style={{color:"black"}}>✓</label>
              <input className="fourthOption" type="radio" name="pick" value="fourthOption"/><label style={{color:"red"}}>✓</label>
            </div>
          </center>
      </div>
    );
  }
}

export default TaskList;
