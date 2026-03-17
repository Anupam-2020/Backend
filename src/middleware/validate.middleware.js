const validateTask = (req, resp, next) => {
    const { title, status } = req.body;

    if(!title || typeof title !== 'string') {
        return resp.status(400).json({
            message: 'Title is required and must be a string'
        })
    }

    const allowedStatuses = ['pending', 'in-progress', 'completed'];

    if(status && !allowedStatuses.includes(status)) {
        return resp.status(400).json({ message: 'Invalid status value' });
    }

    next();
}


const validateTaskUpdate = (req, resp, next) => {
    const { title, status } = req.body;
    const allowedStatuses = ['pending', 'in-progress', 'completed'];

    if(title !== undefined && (typeof title !== 'string' || !title.trim())) {
        return resp.status(400).json({
            message: 'Title must be a non-empty string'
        })
    }

    if(status !== undefined && !allowedStatuses.includes(status)) {
        return resp.status(400).json({
            message: 'Invalid status value'
        })
    }

    next();
}

module.exports = {
    validateTask,
    validateTaskUpdate
}