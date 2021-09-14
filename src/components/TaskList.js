import React from 'react';
import firebase from '../Firebase';
import Task from "./Task.js";
import {getDatabase,ref,query,onValue,set,remove} from 'firebase/database'
import './styles/TaskList.css';


class TaskList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      type : this.props.type,
      tasks: []
    }
    this.input = React.createRef();
    this.readDatabase();
  }

  findGroupData = (query) => {
    return new Promise((resolve,reject) => {
       onValue(query, (snapshot) => {
         if (snapshot.exists()) {
          let tasks = snapshot.val().slice(1,snapshot.val().length)
          let temp = tasks.map((task,index) => (
              <Task key={index+1} content={Object.keys(task)[0]} completion={Object.values(task)[0]} />
          ))
          resolve(temp);
         }
         resolve([]);
       })
    })
  }

  readDatabase() {
    const date = this.props.props.date;
    const formattedDate = date.slice(4,8)+"_"+date.slice(2,4)+"_"+date.slice(0,2)
    const db = getDatabase(firebase);

    const dbRef = ref(db,"Date Page/"+formattedDate+"/"+this.state.type);

    console.log(formattedDate);
    const query1 = query(dbRef);

    this.findGroupData(query1).then((temp) => {
      this.setState({ tasks:temp})
    })
  }

  writeDatabase() {
    const {type,tasks} = this.state;
    const date = this.props.props.date;
    const formattedDate = date.slice(4,8)+"_"+date.slice(2,4)+"_"+date.slice(0,2)

    const db = getDatabase(firebase);
    const dbRef = ref(db,"Date Page/"+formattedDate+"/"+type);

    remove(dbRef);
    tasks.map((task,index) => (
      set(ref(db,"Date Page/"+formattedDate+"/"+type+"/"+(index+1)+"/"+task.props.content),task.props.completion)
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
      console.log("pressed");
      console.log(event.target.checked);
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
    if (event.key !== "Enter") { return; }
    if (event.target.value !== "") {
      const newTasks = [...this.state.tasks,<Task key={this.state.tasks.length+1} content={event.target.value} completion="incomplete"/>]
      this.setState({
        tasks:newTasks
      }, () => {
        this.writeDatabase()
        this.input.current.value =""
      })
    }else{
      alert("Please enter a task!");
    }
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
                <li className="list" key={index-1} draggable="true" onDragStart={e => this.dragStart(e,task)} onDragOver={e => this.dragOver(e,index,task)}
                    onDragEnd={() => this.dragEnd()} >
                    <input type="checkbox"
                    checked={String("complete") === task.props.completion} onChange={() => {}}
                    name="list" onDoubleClick= {e => this.removeTask(e,index)} onClick={e => this.handleClick(e,index)}/>
                    {task} </li>
              ))}
            </ul>
          </div>
            <center>
              <input className="inputForTask" type="text" name="task" size="20" autoComplete="off"
              onKeyDown={e =>this.addTask(e)} ref={this.input}/>
            </center>
        </div>
      );
  }
}

export default TaskList;
