import axios from "axios";
import { useEffect, useState } from "react";
import backendLink from "../variables";
import stylesheet from "../assets/style/style.css"
// import deleteIcon from '../assets/icons/delete.png'

const MainPage = () => {
    const [task, setTask] = useState([]);
    const [activeField, setActiveField] = useState({
        isActive: false,
        activeId: ""
    })
    let [newTaskBeingUpdated, setNewTaskBeingUpdated] = useState("");

    useEffect(() => {
        axios.get(backendLink.allTask)
            .then(response => setTask(response.data))
            .catch(err => console.log(err))
    }, []);

    const addTask = (e, item) => {
        e.preventDefault();
        // console.log(item);
        axios
            .post(backendLink.addTask, {
                task: item
            })
            .then(response => {
                if (response.data === 'Activity Already Added') {
                    alert('Activity Already Added')
                    return
                }
                axios.get(backendLink.allTask)
                    .then(response => setTask(response.data))
                    .catch(err => console.log(err))
            })
        document.getElementById("new_task").value = ""
    }

    const updateTask = (taskId) => {
        setActiveField({
            isActive: true,
            activeId: taskId
        })
    }

    const updateTaskInDB = (e, taskId, newTask) => {
        e.preventDefault()
        setActiveField((prevState) => {
            return { ...prevState, isActive: false }
        })
        axios.put(backendLink.updateTask, {
            id: taskId,
            task: newTask
        })
            .then(response => {
                // console.log(response)
                axios.get(backendLink.allTask)
                    .then(response => setTask(response.data))
                    .catch(err => console.log(err))
                // console.log(response)
            })
        setNewTaskBeingUpdated("")
    }

    const cancelUpdate = () => {
        setActiveField(prevState => {
            return { ...prevState, isActive: false }
        })
    }

    const deleteTask = (id) => {
        axios
            .delete(backendLink.deleteTask, {
                id: id
            })
            .then(() => {
                alert("Task Deleted")
                axios.get(backendLink.allTask)
                    .then(response => setTask(response.data))
                    .catch(err => console.log(err))
            })
    }
    console.log(newTaskBeingUpdated)

    return (
        <>
            <h1 className="container header text-center">
                All Task
            </h1>
            <div className="container text-center">
                <div className="row">
                    <div className="col-10 input-field">
                        <input type={"text"} placeholder={"Enter New Task"} name="new_task" id="new_task"
                            className="form-control form-control-lg" />
                    </div>
                    <div className="col-2 btn-space">
                        <button type="submit" className="btn btn-primary btn-lg add-task-button"
                            onClick={(e) => addTask(e, document.getElementById("new_task").value)}>Add Task</button>
                    </div>
                </div>


            </div>
            <div className="">

                <ul>
                    {
                        task.map((data, i) => {
                            return (
                                <>
                                    <div className="">
                                        <li key={data._id} id={data._id} className="themed-grid-col container rounded-pill  position-relative">
                                            {
                                                activeField.isActive && activeField.activeId === data._id ?
                                                    <>
                                                        <input placeholder={data.task} id={data._id}
                                                            value={newTaskBeingUpdated || ""} onChange={(e) => setNewTaskBeingUpdated(e.target.value)} />
                                                        <button onClick={(e) => updateTaskInDB(e, data._id, newTaskBeingUpdated)}>Save</button>
                                                        <button onClick={cancelUpdate}>Cancel</button>
                                                    </>
                                                    :
                                                    <>
                                                        <span>{data.task}</span>

                                                        <span className="position-absolute top-50 end-0 translate-middle">

                                                            <img src="../assets/icons/edit.png" alt="test" width="15"
                                                                height="15" onClick={() => updateTask(data._id)} />
                                                            <img src="../assets/icons/delete.png" alt="test" width="15"
                                                                height="15" onClick={() => deleteTask(data._id)} />
                                                        </span>
                                                    </>
                                            }

                                        </li>
                                    </div>
                                </>
                            )
                        })
                    }
                </ul>
            </div>
        </>
    )
}

export default MainPage;