export interface User {
    _id: string;
    Email: string;
    FirstName: string;
    LastName: string;
    Password: string;
    Sport: string[];
    Registered_Tournaments: string[];
    Tournament_History: string[];
}

export interface Tournaments {
    tournamentdata: string | undefined;
    _id: string;
    Tournament_Name: string;
    Sport: string;
    Description: string;
    Status: string;
    Start_Date: string;
    End_Date: string;
    Attendance_Time: string;
    Format: string;
    Registered_Users: string[];
    Attendance_Place: string;
}

export interface Sport {
    _id: string;
    Name: string;
    Incoming_Tournaments: number;
    Attented_Users: string[];
}