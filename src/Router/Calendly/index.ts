import { Router, Request, Response } from "express";
const CalendlyRouter = Router();
CalendlyRouter.get('/candidate-schedule-event', (req: Request): void => {
    try {
        const body = req.body;
        console.log("Calendly Body ================================>", body);
        return;
    } catch (error) {
        return;
    }
})
export default CalendlyRouter;