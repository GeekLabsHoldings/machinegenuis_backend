import { Router, } from "express";
import * as tasksController from "../../../Controller/Operations/tasks/tasks.controller"



const TasksRouter = Router();


// get add Brand routes
TasksRouter.post("/add-task", tasksController.addTasks);
TasksRouter.post("/update-task", tasksController.updateTasks);
TasksRouter.post("/delete-task", tasksController.deleteTasks);
TasksRouter.get("/get-all-tasks", tasksController.getAllTasks);
TasksRouter.get("/get-tasks-assignedto", tasksController.getTasksByAssignedTo);
TasksRouter.get("/get-tasks-createdby", tasksController.getTasksByCreatedBy);
TasksRouter.get("/get-tasks-brand", tasksController.getTasksByBrand);
TasksRouter.get("/get-tasks-department", tasksController.getTasksByDepartment);
TasksRouter.get("/get-all-employees", tasksController.getAllEmployees);
TasksRouter.get("/get-employees-department", tasksController.getEmployeesByDepartment);

export default TasksRouter;