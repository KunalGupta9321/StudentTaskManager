import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const API_URL = "http://localhost:5000/api/tasks";

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add task
  const addTask = async () => {
    if (!title.trim()) return;

    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      setTitle("");
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // Toggle task
  const toggleTask = async (task) => {
    try {
      await fetch(`${API_URL}/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Student Task Manager</h1>
        <p className="subtitle">
          Stay organized. Get things done.
        </p>

        <div className="input-section">
          <input
            type="text"
            placeholder="Enter your task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addTask();
            }}
          />

          <button onClick={addTask}>Add Task</button>
        </div>

        <h2>My Tasks</h2>

        <div className="task-list">
          {tasks.length === 0 ? (
            <p className="empty">No tasks yet. Add one!</p>
          ) : (
            tasks.map((task) => (
              <div className="task" key={task._id}>
                <div
                  className={`task-title ${
                    task.completed ? "completed" : ""
                  }`}
                  onClick={() => toggleTask(task)}
                >
                  <span className="checkbox">
                    {task.completed ? "✓" : "○"}
                  </span>

                  {task.title}
                </div>

                <button
                  className="delete"
                  onClick={() => deleteTask(task._id)}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;