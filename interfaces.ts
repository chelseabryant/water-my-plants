export interface IUser {
    id: number,
    username: string,
    email: string
}

export interface IPlant {
    id: number,
    name: string,
    botanical: string,
    sun: string,
    water: string,
    fertilize: string,
    temperature: string,
    humidity: string,
    image: string
}

export interface IMyPlant {
    id: number,
    name: string,
    image: string
}

export interface ICalendar {
    id: number,
    user_id: number,
    title: string,
    start_date: string,
    end_date: string,
    notes: string,
    plant_ids: string
}
