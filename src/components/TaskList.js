import React from "react";
import firebase from "../Firebase";
import Task from "./Task.js";
import "./styles/TaskList.css";

class TaskList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type,
      tasks: [],
    };
    this.input = React.createRef();
    this.readDatabase();
  }

  readDatabase() {
    const date = this.props.props.date;
    const formattedDate = date.slice(4, 8) + "_" + date.slice(2, 4) + "_" + date.slice(0, 2);
    firebase
      .database()
      .ref("Date Page")
      .child(formattedDate)
      .child(this.state.type)
      .once("value", (result) => {
        if (result.exists()) {
          let tasks = result.val().slice(1, result.val().length);
          let temp = tasks.map((task, index) => (
            <Task
              key={index + 1}
              content={Object.keys(task)[0]}
              completion={Object.values(task)[0]}
            />
          ));
          this.setState({
            tasks: temp,
          });
        }
      });
  }

  writeDatabase() {
    const { type, tasks } = this.state;
    const date = this.props.props.date;
    const formattedDate = date.slice(4, 8) + "_" + date.slice(2, 4) + "_" + date.slice(0, 2);

    firebase.database().ref("Date Page").child(formattedDate).child(type).remove();
    tasks.map((task, index) =>
      firebase
        .database()
        .ref("Date Page")
        .child(formattedDate)
        .child(type)
        .child(index + 1)
        .child(task.props.content)
        .set(task.props.completion)
    );
  }

  removeTask(event, index) {
    if (window.confirm("Are you sure you wish to delete this item?")) {
      let tasks = this.state.tasks;
      tasks.splice(index, 1);
      this.setState(
        {
          tasks: tasks,
        },
        () => {
          this.writeDatabase();
        }
      );
    }
  }

  handleClick(event, index) {
    console.log("pressed");
    console.log(event.target.checked);
    let check = "incomplete";
    if (event.target.checked) {
      check = "complete";
    }
    let tasks = this.state.tasks;
    let task = tasks[index];
    tasks[index] = <Task key={index + 1} content={task.props.content} completion={check} />;
    this.setState(
      {
        tasks: tasks,
      },
      () => {
        this.writeDatabase();
      }
    );
  }

  addTask(event) {
    if (event.key !== "Enter") {
      return;
    }
    if (event.target.value !== "") {
      const newTasks = [
        ...this.state.tasks,
        <Task
          key={this.state.tasks.length + 1}
          content={event.target.value}
          completion="incomplete"
        />,
      ];
      this.setState(
        {
          tasks: newTasks,
        },
        () => {
          this.writeDatabase();
          this.input.current.value = "";
        }
      );
    } else {
      alert("Please enter a task!");
    }
  }

  dragStart = (event, task) => {
    this.draggedItem = task;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/html", event.target.parentNode);
  };

  dragOver = (e, index, draggedOverTask) => {
    if (this.draggedItem === draggedOverTask) {
      return;
    }
    let tasks = this.state.tasks.filter((x) => x !== this.draggedItem);
    tasks.splice(index, 0, this.draggedItem);
    this.setState({ tasks });
  };

  dragEnd = () => {
    this.draggedIdx = null;
    this.writeDatabase();
  };

  render() {
    return (
      <div className="position" id={this.props.position}>
        <h1>
          <center>{this.state.type}</center>
        </h1>
        <div className="inner-container">
          <ul>
            {this.state.tasks.map((task, index) => (
              <li
                className="list"
                key={index - 1}
                draggable="true"
                onDragStart={(e) => this.dragStart(e, task)}
                onDragOver={(e) => this.dragOver(e, index, task)}
                onDragEnd={() => this.dragEnd()}
              >
                <input
                  type="checkbox"
                  checked={String("complete") === task.props.completion}
                  onChange={() => {}}
                  name="list"
                  onDoubleClick={(e) => this.removeTask(e, index)}
                  onClick={(e) => this.handleClick(e, index)}
                />
                {task}{" "}
              </li>
            ))}
          </ul>
        </div>
        <h1>
          <input
            className="inputForTask"
            type="text"
            name="task"
            size="20"
            autoComplete="off"
            onKeyDown={(e) => this.addTask(e)}
            ref={this.input}
          />
        </h1>
      </div>
    );
  }
}

export default TaskList;
