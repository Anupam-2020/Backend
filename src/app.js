const express = require('express');
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const errormiddleware = require('./middleware/error.middleware');

const app = express();
app.use(express.json());

app.get('/', (req, resp) => {
    resp.status(200).json({
        message: 'Task manager API running'
    })
})
app.use('/api/v1/auth/', authRoutes);
app.use('/api/v1/tasks/', taskRoutes);

app.use(errormiddleware);

module.exports = app;