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
