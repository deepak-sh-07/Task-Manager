import { useState } from 'react';
import styles from '../Css/add.module.css';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState("Pending"); // ✅ default value
  const navigate = useNavigate();

 const handleAdd = async () => {
  if (!title) {
    alert("Task title is required");
    return;
  }

  try {
    const token = localStorage.getItem("token"); // ✅ get token
    if (!token) {
      alert("You must be logged in to add a task");
      return;
    }

    const res = await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // ✅ send token
      },
      body: JSON.stringify({ title, desc, status }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed to add task");
      return;
    }

    console.log("Task added:", data);
    navigate("/home");
  } catch (err) {
    console.error("Error adding task:", err.message);
  }
};


  return (
    <div className={styles.container}>
      <div className={styles.sub}>
        <div className={styles.title}>Add a new Task</div>
        <div className={styles.des}>
          Fill in the details below to create a new task.
        </div>
        <div className={styles.info}>
          <div className={styles.tasktitle}>
            Task Title
            <input
              type="text"
              placeholder="e.g., Design the new dashboard"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className={styles.taskdesc}>
            Description
            <input
              type="text"
              placeholder="Provide a detailed description of the task"
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className={styles.status}>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className={styles.buttons}>
            <button onClick={() => navigate("/home")}>Cancel</button>
            <button className={styles.add} onClick={handleAdd}>
              ADD task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
