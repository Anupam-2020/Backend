const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const {
  createTask,
  deleteTask,
  updateTask,
  getAllTasks,
  getTaskById,
} = require("../controllers/task.controller");
const { validateTask, validateTaskUpdate } = require("../middleware/validate.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post('/', validateTask, createTask);
router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.patch('/:id', validateTaskUpdate, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;