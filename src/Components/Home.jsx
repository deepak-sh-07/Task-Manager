import '../Css/home.css';
import logo from '../assets/logo.svg';
import user from '../assets/user.svg';
import search from '../assets/search.svg';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [titleEdit, setTitleEdit] = useState("");
  const [descEdit, setDescEdit] = useState("");
  const [statusEdit, setStatusEdit] = useState("Pending");
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  // Show welcome toast only once per session
  useEffect(() => {
    const hasWelcomed = sessionStorage.getItem("hasWelcomed");
    if (username && !hasWelcomed) {
      toast.success(`Welcome back, ${username}!`);
      sessionStorage.setItem("hasWelcomed", "true");
    }
  }, [username]);

  // Fetch tasks from backend
  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to fetch tasks:", text);
        return;
      }
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = () => {
    navigate("/Add");
    toast.info("Navigate to Add Task page");
  };

  const openEditDialog = (task) => {
    setSelectedTask(task);
    setTitleEdit(task.title);
    setDescEdit(task.desc || "");
    setStatusEdit(task.status || "Pending");
  };

  const closeDialog = () => {
    setSelectedTask(null);
  };

  const handleSave = async () => {
    if (!selectedTask) return;
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${selectedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: titleEdit,
          desc: descEdit,
          status: statusEdit
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to update task:", text);
        toast.error("Failed to update task");
        return;
      }

      const updatedTask = await res.json();
      setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
      closeDialog();
      toast.success("Task updated successfully");
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error("Error updating task");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to delete task:", text);
        toast.error("Failed to delete task");
        return;
      }
      setTasks(tasks.filter(task => task._id !== id));
      closeDialog();
      toast.success("Task deleted successfully");
    } catch (err) {
      console.error("Error deleting task:", err);
      toast.error("Error deleting task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    sessionStorage.removeItem("hasWelcomed");
    window.dispatchEvent(new Event("storage"));
    toast.info("Logged out successfully");
    navigate("/");
  };

  const filteredTasks = tasks.filter(task =>
    task.title.includes(searchQuery) ||
    (task.desc && task.desc.includes(searchQuery))
  );

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      <div className="top">
        <div className="left">
          <img src={logo} alt="" />
          <div className="logoname">Task Manager</div>
          <div className="links">
            <div className="mytasks">My Tasks</div>
            <div className="addtask" onClick={handleAdd}>Add Task</div>
            <div className="logout" onClick={handleLogout}>Logout</div>
          </div>
        </div>
        <div className="right">
          <img src={user} alt="" />
        </div>
      </div>

      <div className="sub">
        <div className="tasks">My Tasks</div>
        <div className="search">
          <img src={search} alt="" />
          <input
            type="text"
            placeholder='Search my tasks'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="infotasks">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => {
              const preview = task.desc?.length > 14 ? task.desc.slice(0, 14) + "..." : task.desc || "";
              return (
                <div
                  key={task._id}
                  className="task"
                  onClick={() => openEditDialog(task)}
                >
                  <div className='tt'>{task.title}</div>
                  <div className="des">{preview}</div>
                  <div className={`status ${task.status?.toLowerCase()}`}>
                    {task.status || "Pending"}
                  </div>
                </div>
              );
            })
          ) : (
            <p>No tasks found</p>
          )}
        </div>
      </div>

      {selectedTask && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Task</h3>
            <input
              type="text"
              value={titleEdit}
              onChange={(e) => setTitleEdit(e.target.value)}
              placeholder="Title"
            />
            <textarea
              value={descEdit}
              onChange={(e) => setDescEdit(e.target.value)}
              placeholder="Description"
            />
            <select value={statusEdit} onChange={(e) => setStatusEdit(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="modal-buttons">
              <button onClick={handleSave}>Save</button>
              <button onClick={closeDialog}>Cancel</button>
              <button
                onClick={() => handleDelete(selectedTask._id)}
                style={{ backgroundColor: 'red', color: 'white' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
