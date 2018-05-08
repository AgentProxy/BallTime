export interface User{
    uid: string;
    username: string;
    firstname: string;
    lastname: string;
    middle_initial: string;
    age: number;
    height: string;
    weight: number;
    profile_pic?: string;
    registered: boolean;
    role: string;
    latitude: string,
    longitude: string,
    penalty: number,
    reputation_level: number;
    reputation_points: number;
}