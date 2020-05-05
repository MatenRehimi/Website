import React from 'react';
import firebase from '../Firebase';
import Task from "./Task.js";

class TaskList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type : this.props.type,
      tasks: []
    }
    this.readDatabase();
  }

  readDatabase() {
    firebase.database().ref(this.state.type).child("tasks").child(this.props.props.year).child(this.props.props.month).child(this.props.props.day)
    .once("value", result => {
      if (result.exists()) {
        let tasks = result.val().slice(1,result.val().length)
        let temp = tasks.map((task,index) => (
           <Task key={index+1} content={Object.keys(task)[0]} completion={Object.values(task)[0]} />
        ))
        this.setState({
          tasks:temp
        })
      }
    })
  }

  writeDatabase() {
    const {type,tasks} = this.state;
    firebase.database().ref(this.state.type).child("tasks").child(this.props.props.year).child(this.props.props.month)
      .child(this.props.props.day).remove();
    tasks.map((task,index) => (
      firebase.database().ref(type).child("tasks").child(this.props.props.year).child(this.props.props.month)
          .child(this.props.props.day).child(index+1).child(task.props.content).set(task.props.completion)
    ));
  }

  removeTask(event,index) {
    if(window.confirm('Are you sure you wish to delete this item?')) {
      let tasks = this.state.tasks;
      tasks.splice(index,1)
      this.setState({
        tasks:tasks
      }, () => {
        this.writeDatabase()
      })
    }
  }

  handleClick(event,index){
    let check = "incomplete";
    if (event.target.checked) {
      check = "complete"
    }
    let tasks = this.state.tasks;
    let task=tasks[index];
    tasks[index]=<Task key={index+1} content={task.props.content} completion={check} />
    this.setState({
      tasks:tasks
    }, () => {
      this.writeDatabase()
    })
  }

  addTask(event) {
    if (event.key !== "Enter") {
      return;
    }
    if (event.target.value !== "") {
      let temp = this.state.tasks;
      temp.push(<Task key={this.state.tasks.length+1} content={event.target.value} completion="incomplete"/>)
      this.setState({
        tasks:temp
      }, () => {
        this.writeDatabase()
      })
    }else{
      alert("Please enter a task!");
    }
  }

  getOptionPicked(event) {
    firebase.database().ref(this.state.type).child("dayRating").child(this.props.props.year).child(this.props.props.month)
    .child(this.props.props.day).set(event.target.value)
  }

  dragStart =(event,task)=> {
    this.draggedItem = task;
    event.dataTransfer.effectAllowed="move"
    event.dataTransfer.setData('text/html',event.target.parentNode)

  }

  dragOver = (e,index,draggedOverTask) => {
    if (this.draggedItem === draggedOverTask) {
      return;
    }
    let tasks = this.state.tasks.filter(x => x !== this.draggedItem);
    tasks.splice(index,0,this.draggedItem)
    this.setState({tasks})

  }

  dragEnd = () => {
    this.draggedIdx = null;
    this.writeDatabase();
  }

  render() {

    return (
        <div className="position" id={this.props.position}>
          <h1>
            <center>{this.state.type}</center>
          </h1>
          <div className="inner-container">
            <ul>
              {this.state.tasks.map((task,index) => (
                <li  key={index-1} onInput={e => this.updateTask(e,index)} draggable="true" onDragStart={e => this.dragStart(e,task)} onDragOver={e => this.dragOver(e,index,task)}
                    onDragEnd={() => this.dragEnd()}>
                    <input id={index} type="checkbox"
                    checked={String("complete") === task.props.completion} onChange={()=>{}}
                    name="list" onDoubleClick= {e => this.removeTask(e,index)} onClick={e => this.handleClick(e,index)}/>
                    {task} </li>
              ))}
            </ul>
          </div>
            <center>
              <input className="inputForTask" type="text" name="task" size="40" autoComplete="off"
              onKeyDown={e =>this.addTask(e)} />
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
