import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Task from './Task';
import { PDFDownloadLink, Document, Page, Text } from '@react-pdf/renderer';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const response = await axios.get('/api/tasks');
        setTasks(response.data);
    };

    const addTask = async () => {
        if (newTask.trim() === '') return;
        const response = await axios.post('/api/tasks', { description: newTask });
        setTasks([...tasks, response.data]);
        setNewTask('');
    };

    const deleteTask = async (id) => {
        await axios.delete(`/api/tasks/${id}`);
        setTasks(tasks.filter(task => task.id !== id));
    };

    const toggleCompletion = async (id, completed) => {
        await axios.put(`/api/tasks/${id}`, { completed: !completed });
        fetchTasks();
    };

    return (
        <div className="task-list">
            <header>
                <img src="/shanture-logo.png" alt="Shanture Logo" />
            </header>
            <div className="task-input">
                <input 
                    type="text" 
                    value={newTask} 
                    onChange={(e) => setNewTask(e.target.value)} 
                    placeholder="New Task" 
                />
                <button onClick={addTask}>Add Task</button>
            </div>
            <ul>
                {tasks.map(task => (
                    <Task 
                        key={task.id} 
                        task={task} 
                        onDelete={deleteTask} 
                        onToggle={toggleCompletion} 
                    />
                ))}
            </ul>
            <PDFDownloadLink document={<TaskDocument tasks={tasks} />} fileName="tasks.pdf">
                {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
            </PDFDownloadLink>
        </div>
    );
};

const TaskDocument = ({ tasks }) => (
    <Document>
        <Page>
            {tasks.map(task => (
                <Text key={task.id}>{task.description} - {task.completed ? 'Completed' : 'Pending'}</Text>
            ))}
        </Page>
    </Document>
);

export default TaskList;
