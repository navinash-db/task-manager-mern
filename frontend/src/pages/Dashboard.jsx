import { useEffect, useState } from "react";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
  try {
    const token = localStorage.getItem("token");

    await api.delete(`/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchTasks();
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
};

  const completeTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.put(
        `/tasks/${id}`,
        {
          status: "Completed",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTasks();
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const editTask = (task) => {
    setEditingTask(task);

    setTitle(task.title);
    setDescription(task.description);
  };

  const createTask = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (editingTask) {
        await api.put(
          `/tasks/${editingTask._id}`,
          {
            title,
            description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setEditingTask(null);
      } else {
        await api.post(
          "/tasks",
          {
            title,
            description,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      setTitle("");
      setDescription("");

      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
  <div className="dashboard-container">
    <h1 className="dashboard-title">Dashboard</h1>

    <button
      className="logout-btn"
      onClick={logout}
    >
      Logout
    </button>

    <h2 className="section-title">
      Create Task
    </h2>

    <form
      className="task-form"
      onSubmit={createTask}
    >
      <input
        className="task-input"
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="task-textarea"
        placeholder="Task Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <button
        className="add-btn"
        type="submit"
      >
        {editingTask ? "Update Task" : "Add Task"}
      </button>
    </form>

    <h2 className="section-title">
      My Tasks
    </h2>

    {tasks.length === 0 ? (
      <p className="no-tasks">
        No Tasks Found
      </p>
    ) : (
      <div className="tasks-grid">
        {tasks.map((task) => (
  <div
    key={task._id}
    className="task-card"
  >
    <h3>{task.title}</h3>

    <p>{task.description}</p>

    <p className="task-status">
      Status: {task.status}
    </p>

    <div className="action-buttons">
  <button
    className="edit-btn"
    onClick={() => editTask(task)}
  >
    Edit
  </button>

  {task.status !== "Completed" && (
    <button
      className="complete-btn"
      onClick={() => completeTask(task._id)}
    >
      Mark Complete
    </button>
  )}

  <button
    className="delete-btn"
    onClick={() => deleteTask(task._id)}
  >
    Delete
  </button>
</div>
  </div>
))}
      </div>
    )}
  </div>
);
}

export default Dashboard;