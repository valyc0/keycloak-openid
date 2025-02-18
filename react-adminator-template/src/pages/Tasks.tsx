import React, { useEffect, useState } from 'react';
import { Task } from '../types/models';
import { taskService } from '../services/api';
import { useAuth } from 'react-oidc-context';
import { Navigate } from 'react-router-dom';

const Tasks: React.FC = () => {
  const auth = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' as const });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAll();
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchTasks();
    }
  }, [auth.isAuthenticated]);

  // Create task
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await taskService.create({
        ...newTask,
        userId: 1 // Using a default user ID for demo
      });
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', status: 'pending' });
    } catch (err) {
      setError('Failed to create task');
      console.error(err);
    }
  };

  // Update task
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      setError(null);
      const response = await taskService.update(editingTask.id, {
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status,
        userId: editingTask.userId
      });
      setTasks(tasks.map(task => 
        task.id === editingTask.id ? response.data : task
      ));
      setEditingTask(null);
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    }
  };

  // Delete task
  const handleDeleteTask = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      setError(null);
      await taskService.delete(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    }
  };

  if (!auth.isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Tasks Management</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Create Task Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h4 className="mb-0">Create New Task</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreateTask}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                placeholder="Enter task description"
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                required
                rows={3}
              />
            </div>
            <button type="submit" className="btn btn-primary">Create Task</button>
          </form>
        </div>
      </div>

      {/* Tasks List */}
      <div className="row">
        {tasks.map(task => (
          <div key={task.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100">
              {editingTask?.id === task.id ? (
                <div className="card-body">
                  <form onSubmit={handleUpdateTask}>
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={editingTask.title}
                        onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        value={editingTask.description}
                        onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                        required
                        rows={3}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-control"
                        value={editingTask.status}
                        onChange={e => setEditingTask({ 
                          ...editingTask, 
                          status: e.target.value as 'pending' | 'completed'
                        })}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-success me-2">Save</button>
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setEditingTask(null)}
                    >
                      Cancel
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="mb-0">{task.title}</h5>
                      <span className={`badge ${task.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">{task.description}</p>
                    <div className="mt-3">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => setEditingTask(task)}
                      >
                        <i className="fa fa-edit me-1"></i>Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <i className="fa fa-trash me-1"></i>Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && !loading && (
        <div className="text-center mt-4">
          <p className="text-muted">No tasks found. Create your first task above!</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
