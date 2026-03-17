const { tasks } = require('../data/db');

const createTask = (req, resp, next) => {
    try {
        const { title, description, status } = req.body;
        const newTask = {
            id: tasks.length + 1,
            title,
            description: description || '',
            status: status || 'pending',
            userId: req.user.userId, // Associate the task with the authenticated user's ID from the auth middleware
            createdAt: new Date().toISOString()
        }

        tasks.push(newTask);

        resp.status(201).json({
            message: 'Task created successfully',
            data: newTask
        });
    } catch(error) {
        next(error) // Pass the error to the error handling middleware
    }
}


const getAllTasks = (req, resp, next) => {
    try {
        let userTasks = tasks.filter(task => task.userId === req.user.userId);
        
        const {status, search, sort, order} = req.query;

        if(status) {
            userTasks = userTasks.filter(task => task.status === status);
        }

        if(search) {
            userTasks = userTasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()));
        }

        if(sort) {
            userTasks.sort((a, b) => {
                switch(sort) {
                    case "createdAt":
                        return order === 'desc'
                            ? new Date(b.createdAt) - new Date(a.createdAt)
                            : new Date(a.createdAt) - new Date(b.createdAt)
                    case "title":
                        return order === 'desc'
                            ? b.title.localeCompare(a.title)
                            : a.title.localeCompare(b.title);
                    case "status":
                        return order === 'desc'
                            ? b.status.localeCompare(a.status)
                            : a.status.localeCompare(b.status)
                }

                return 0;
            })
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        const paginatedTasks = userTasks.slice(startIndex, endIndex);

        resp.status(200).json({
            message: 'Tasks fetched successfully',
            data: paginatedTasks,
            meta: {
                total: userTasks.length,
                page,
                limit,
                totalPages: Math.ceil(userTasks.length / limit),
                filters: {
                    status: status || null,
                    search: search || null
                },
                sort: {
                    field: sort || null,
                    order: order || 'asc'
                }
            }
        })
    } catch(error) {
        next(error)
    }
}


const getTaskById = (req, resp, next) => {
    try {
        const task = tasks.find(task => task.id === Number(req.params.id) && task.userId === req.user.userId);
        if(!task) {
            return resp.status(404).json({
                message: 'Task not found'
            });
        }

        resp.status(200).json({
            message: 'Task fetched successfully',
            data: task
        })
    } catch(error) {
        next(error)
    }
}

const updateTask = (req, resp, next) => {
    try {
        const { title, description, status } = req.body;
        console.log(req);
        const taskToUpdate = tasks.find(task => task.id === Number(req.params.id) && task.userId === req.user.userId);
        if(!taskToUpdate) {
            return resp.status(404).json({
                messaage: 'Task not found'
            })
        }

        if(title !== undefined) taskToUpdate.title = title;
        if(description !== undefined) taskToUpdate.description = description;
        if(status !== undefined) taskToUpdate.status = status;

        resp.status(200).json({
            message: 'Task updated successfully',
            data: taskToUpdate
        })
    } catch(error) {
        next(error)
    }
}


const deleteTask = (req, resp, next) => {
    try {
        const index = tasks.findIndex(task => task.id === Number(req.params.id) && task.userId === req.user.userId);

        if(index === -1) {
            return resp.status(404).json({
                success: false,
                message: 'Task not found'
            })
        }

        tasks.splice(index, 1);

        resp.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        })

    } catch(error) {
        next(error);
    }
}

module.exports = {
    createTask,
    getAllTasks,
    deleteTask,
    getTaskById,
    updateTask
}