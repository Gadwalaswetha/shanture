import React from 'react';

const Task = ({ task, onDelete, onToggle }) => {
    return (
        <li className={task.completed ? 'completed' : ''}>
            <input 
                type="checkbox" 
                checked={task.completed} 
                onChange={() => onToggle(task.id, task.completed)} 
            />
            {task.description}
            <button onClick={() => onDelete(task.id)}>Delete</button>
        </li>
    );
};

export default Task;
