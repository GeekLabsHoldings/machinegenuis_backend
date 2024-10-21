import { Request, Response } from "express";
import systemError from "../../../Utils/Error/SystemError";
import * as tasksServices from "../../../Service/Operations/tasks/tasks.service"
import EventService from "../../../Service/HR/Event/EventService";
import IEventModel from "../../../Model/event/IEventModel";
import EmployeeService from "../../../Service/Employee/EmployeeService";



export async function addTasks(req:Request, res:Response) {
    try {
        const taskData:IEventModel = {...req.body.taskData,createdBy:req.body.currentUser._id,
             start:new Date(req.body.taskData.startNumber).toLocaleString(),
             end:new Date(req.body.taskData.endNumber).toLocaleString()}

        const task = await EventService.createEvent(taskData, null)
        res.json(task)
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}



export async function updateTasks(req:Request, res:Response) {
    try {
        const taskData:IEventModel = req.body.taskData
        const taskId = req.body.taskId    
        const task = await EventService.editEvent(taskId, taskData)
        if(task)
            return res.json(task)
        else
            return res.status(404).json({message:"task not found"})
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}



export async function deleteTasks(req:Request, res:Response) {
    try {

        const taskId = req.body.taskId    
        const task = await EventService.deleteEvent(taskId)
        if(task)
            return res.json({message:"task deleted successfully"})
        else
            return res.status(404).json({message:"task not found"})
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}




export async function getAllTasks(req:Request, res:Response) {
    try {

        const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
        const limit = parseInt(String(req.query.limit)) || 1000; // Default to 10 items per page if not provided
        const skip = (page - 1) * limit;

        const tasks = await EventService.getAllTasks(limit, skip)
        if(tasks)
            return res.json(tasks)
        else
            return res.status(404).json({message:"tasks not found"})
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}


//=========================================================================



export async function getTasksByAssignedTo(req:Request, res:Response) {
    try {
        const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
        const limit = parseInt(String(req.query.limit)) || 1000; // Default to 10 items per page if not provided
        const skip = (page - 1) * limit;

        const user = String(req.query.user_id) || req.body.currentUser._id
        const tasks = await EventService.getTasksByAssignedTo(user, limit, skip)
        if(tasks)
            return res.json(tasks)
        else
            return res.status(404).json({message:"tasks not found"})
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}

export async function getTasksByCreatedBy(req:Request, res:Response) {
    try {
        const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
        const limit = parseInt(String(req.query.limit)) || 1000; // Default to 10 items per page if not provided
        const skip = (page - 1) * limit;

        const user = String(req.query.user_id) || req.body.currentUser._id
        const tasks = await EventService.getTasksByCreatedBy(user, limit, skip)
        if(tasks)
            return res.json(tasks)
        else
            return res.status(404).json({message:"tasks not found"})
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}


export async function getTasksByBrand(req:Request, res:Response) {
    try {
        const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
        const limit = parseInt(String(req.query.limit)) || 1000; // Default to 10 items per page if not provided
        const skip = (page - 1) * limit;

        const brand = String(req.query.brand) 
        const tasks = await EventService.getTasksByBrand(brand, limit, skip)  
        if(tasks)
            return res.json(tasks)
        else
            return res.status(404).json({message:"tasks not found"})
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}


export async function getTasksByDepartment(req:Request, res:Response) {
    try {
        const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
        const limit = parseInt(String(req.query.limit)) || 1000; // Default to 10 items per page if not provided
        const skip = (page - 1) * limit;

        const department = String(req.query.department) ||  req.body.currentUser._id.department[0]
        const tasks = await EventService.getTasksByDepartment(department, limit, skip)  
        if(tasks)
            return res.json(tasks)
        else
            return res.status(404).json({message:"tasks not found"})
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}

//

export async function getAllEmployees(req:Request, res:Response) {
    try {
        const department = String(req.query.department) ||  req.body.currentUser._id.department[0]
        const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
        const limit = parseInt(String(req.query.limit)) || 1000; // Default to 10 items per page if not provided
        const skip = (page - 1) * limit;

        const employees = await EmployeeService.getAllEmployee(null, null,limit|999,skip|0)
        if(employees)
            return res.json(employees)
        else
            return res.status(404).json({message:"employees not found"})
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}

export async function getEmployeesByDepartment(req:Request, res:Response) {

    try {
        const department = String(req.query.department) ||  req.body.currentUser._id.department[0]
        const page = parseInt(String(req.query.page)) || 1; // Default to page 1 if not provided
        const limit = parseInt(String(req.query.limit)) || 1000; // Default to 10 items per page if not provided
        const skip = (page - 1) * limit;

        const employees = await EmployeeService.getAllEmployee(null, department, limit|999, skip|0)
        if(employees)
            return res.json(employees)
        else
            return res.status(404).json({message:"employees not found"})
    } catch (error) {
        console.log(error);
        return systemError.sendError(res, error);
    }
}