import { ClientSession, PipelineStage, Types } from "mongoose";
import { ICreateTaskBody } from "../../../Controller/Task/ITaskController";
import { ICreateEventBody } from "../../../Controller/HR/Event/IEventController";
import eventModel from "../../../Model/event/EventModel";
import IEventModel from "../../../Model/event/IEventModel";
import { ErrorMessages } from "../../../Utils/Error/ErrorsEnum";
import systemError from "../../../Utils/Error/SystemError";
import IEventService from "./IEventService";
import { SchemaTypesReference } from "../../../Utils/Schemas/SchemaTypesReference";
import IEmployeeModel from "../../../Model/Employee/IEmployeeModel";
import { IBrand } from "../../../Model/Operations/IBrand_interface";

class EventService implements IEventService {
    async createEvent(event: IEventModel | ICreateEventBody | ICreateTaskBody, session: ClientSession|null): Promise<IEventModel> {
        try {
            const newEvent = new eventModel(event);
            const result = await newEvent.save({ session });
            return result;
        } catch (error) {
            console.log(error);
            return systemError.setStatus(406).setMessage(ErrorMessages.CAN_NOT_CREATE_EVENT).setData({ error }).throw()
        }
    }
    async getOneEvent(_id: string): Promise<IEventModel | null> {
        const result = await eventModel.findById(_id).populate({
            path: 'createdBy',
            select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
        });
        return result
    }
    async getMonthEvents(): Promise<IEventModel[]> {
        const result = await eventModel.find({ assignedTo: null }).populate({
            path: 'createdBy',
            select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
        }).sort({ startNumber: 1 });
        return result;
    }
    async getMonthTasks(employee: string): Promise<IEventModel[]> {
        const result = await eventModel.find({ $or: [{ assignedTo: employee }, { assignedTo: null }] }).populate({
            path: 'createdBy',
            select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
        }).populate({
            path: 'assignedTo',
            select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
        }).sort({ startNumber: 1 });
        return result;
    }
    async getDepartmentTask(department: string): Promise<IEventModel[]> {
        const pipeline: PipelineStage[] = ([
            {
                $lookup: {
                    from: 'employees',
                    localField: 'assignedTo',
                    foreignField: '_id',
                    as: 'employee'
                }
            },
            {
                $unwind: '$employee'
            },
            ...(department ? [{
                $match: {
                    'employee.department': department
                }
            }] : []),
            {
                $sort: { startNumber: 1 }
            },
            {
                $project: {
                    title: 1,
                    start: 1,
                    end: 1,
                    backgroundColor: 1,
                    articleImg: 1,
                    article: 1,
                    articleTitle: 1,
                    assignedTo: {
                        _id: '$employee._id',
                        firstName: '$employee.firstName',
                        lastName: '$employee.lastName',
                        department: '$employee.department',
                        theme: '$employee.theme'
                    }
                }
            }
        ]);
        const result = await eventModel.aggregate(pipeline);
        return result;
    }
    async updateTask(_id: string, articleImg: string, article: string, articleTitle: string, employee: string): Promise<IEventModel | null> {
        return await eventModel.findOneAndUpdate({ _id, assignedTo: employee }, { article, articleTitle, articleImg }, { new: true });
    }
    async editEvent(_id: string, event: IEventModel | ICreateEventBody): Promise<IEventModel | null> {
        return await eventModel.findByIdAndUpdate(_id, event, { new: true });
    }
    async deleteEvent(_id: string): Promise<boolean> {
        const result = await eventModel.deleteOne({ _id });
        return result.deletedCount === 1;
    }

    async getBusyTime(employee_id: string, startTime: number, endTime: number): Promise<IEventModel[]> {
        const query = {
            assignedTo: new Types.ObjectId(employee_id),
            $or: [
                { startNumber: { $gte: startTime, $lt: endTime } },
                { endNumber: { $gte: startTime, $lt: endTime } },
                { startNumber: { $lt: startTime }, endNumber: { $gte: endTime } }
            ]
        }
        const result = await eventModel.find(query).exec();
        return result;
    }



    async getAllTasks(limit:number, skip:number){
        try {
            const result = await eventModel.find({}).populate({
                path: 'createdBy',
                select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
            }).populate({
                path: 'assignedTo',
                select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
            }).limit(limit).skip(skip).sort({startNumber:-1});
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async getTasksByDepartment(department: string, limit:number, skip:number){
        try {
            const result = await eventModel.find({department:department}).populate({
                path: 'createdBy',
                select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
            }).populate({
                path: 'assignedTo',
                select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
            }).limit(limit).skip(skip).sort({startNumber:-1});
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async getTasksByAssignedTo(user:string|Types.ObjectId|IEmployeeModel, limit:number, skip:number){
        try {
            const result = await eventModel.find({assignedTo:user}).populate({
                path: 'createdBy',
                select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
            }).populate({
                path: 'assignedTo',
                select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
            }).limit(limit).skip(skip).sort({startNumber:-1});
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async getTasksByCreatedBy(user:string|Types.ObjectId|IEmployeeModel, limit:number, skip:number){
        try {
            const result = await eventModel.find({createdBy:user}).populate({
                path: 'createdBy',
                select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
            }).populate({
                path: 'assignedTo',
                select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
            }).limit(limit).skip(skip).sort({startNumber:-1});
            return result;
        } catch (error) {
            console.log(error);
        }
    }

    async getTasksByBrand(brand:string|Types.ObjectId|IBrand, limit:number, skip:number){
        try {
            const result = await eventModel.find({brand:brand}).populate({
                path: 'createdBy',
                select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
            }).populate({
                path: 'assignedTo',
                select: { firstName: 1, lastName: 1, department: 1, theme: 1 }
            }).limit(limit).skip(skip).sort({startNumber:-1});

            return result;
        } catch (error) {
            console.log(error);
        }
    }

}

const eventService = new EventService();

export default eventService;