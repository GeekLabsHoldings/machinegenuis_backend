import moment, { Moment } from 'moment-timezone';

moment.tz.setDefault('Africa/Cairo');

const StartOfDay = (now: Moment): number => now.clone().startOf('day').valueOf();

const EndOfDay = (now: Moment): number => now.clone().endOf('day').valueOf();

const StartOfMonth = (now: Moment): number => now.clone().startOf('month').valueOf();

const EndOfMonth = (now: Moment): number => now.clone().endOf('month').valueOf();

const CheckIsLateTime = (now: Moment) => {
    const day = now.day();
    if (day === 5 || day === 6)
        return false
    return now.valueOf() > now.clone().set({ hour: 9, minute: 10, second: 0 }).valueOf();
}

export default moment;
export {
    StartOfDay, EndOfDay, StartOfMonth, EndOfMonth, CheckIsLateTime
}
