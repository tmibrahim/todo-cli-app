#!/usr/bin/env node

//Core Node.js modules to interact with the file system and the process
const fs = require('fs');
const process = require('process');

// File name where the tasks are stored
const todoFile = 'todos.txt';

// Set the assignee from the envionment variable or use 'Unknown' as default
const assignee = process.env.TODO_USERNAME || 'Unknown';

// Helper function to read from the todoFile
function readTasks() {
    if (fs.existsSync(todoFile)) {
        const tasks = fs.readFileSync(todoFile, 'utf8')
            .split('\n')
            .filter(Boolean)
            .map(task => JSON.parse(task));
        return tasks;
    }
    return [];
}

function writeTasks(tasks) {
    const tasksString = tasks.map(task => JSON.stringify(task)).join('\n');
    fs.writeFileSync(todoFile, tasksString + '\n');
}

function displayTasks(tasks, title) {
    console.log(title);
    tasks.forEach(task => {
        console.log(`Task ${task.id}:`);
        console.log(`Title: ${task.title}`);
        console.log(`Assignee: ${task.assignee}`);
        console.log(`Done: ${task.done}`);
        console.log('-------------------------');
    });
}

// Task operations
function addTask(description) {
    const tasks = readTasks();
    const newTask = {
        id: tasks.length + 1,
        title: description,
        assignee: assignee,
        done: false
    };
    tasks.push(newTask);
    writeTasks(tasks);
    console.log('Task added successfully.');
}

function listTasks() {
    const tasks = readTasks();
    displayTasks(tasks, 'All tasks:');
}

function markTaskDone(id) {
    const tasks = readTasks();
    const updatedTasks = tasks.map(task => {
        if (task.id == id) task.done = true;
        return task;
    });
    writeTasks(updatedTasks);
    console.log(`Task ${id} marked as done.`);
}

function markTaskUndone(id) {
    const tasks = readTasks();
    const updatedTasks = tasks.map(task => {
        if (task.id == id) task.done = false;
        return task;
    });
    writeTasks(updatedTasks);
    console.log(`Task ${id} marked as undone.`);
}

function listDoneTasks() {
    const tasks = readTasks();
    const doneTasks = tasks.filter(task => task.done);
    displayTasks(doneTasks, 'Done tasks:');
}

function listUndoneTasks() {
    const tasks = readTasks();
    const undoneTasks = tasks.filter(task => !task.done);
    displayTasks(undoneTasks, 'Undone tasks:');
}

function deleteTask(id) {
    const tasks = readTasks();
    const remainingTasks = tasks.filter(task => task.id != id);
    writeTasks(remainingTasks);
    console.log(`Task ${id} deleted.`);
}

function updateTask(id, description) {
    const tasks = readTasks();
    const updatedTasks = tasks.map(task => {
        if (task.id == id) task.title = description;
        return task;
    });
    writeTasks(updatedTasks);
    console.log(`Task ${id} updated.`);
}

function countDoneTasks() {
    const tasks = readTasks();
    const count = tasks.reduce((accumulator, task) => task.done ? accumulator + 1 : accumulator, 0);
    console.log(`Total done tasks: ${count}`);
}

// Command processing
const [command, ...args] = process.argv.slice(2);

switch (command) {
    case 'add':
        addTask(args.join(' '));
        break;
    case 'list':
        listTasks();
        break;
    case 'done':
        markTaskDone(args[0]);
        break;
    case 'undone':
        markTaskUndone(args[0]);
        break;
    case 'list-done':
        listDoneTasks();
        break;
    case 'list-undone':
        listUndoneTasks();
        break;
    case 'delete':
        deleteTask(args[0]);
        break;
    case 'update':
        updateTask(args[0], args.slice(1).join(' '));
        break;
    case 'count-done':
        countDoneTasks();
        break;
    default:
        console.log('Invalid command.');
        break;
}
