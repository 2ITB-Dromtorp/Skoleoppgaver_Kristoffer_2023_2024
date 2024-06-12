export interface User {
    Email: string;
    FirstName: string;
    LastName: string;
    Password: string;
    Sport: string;
    Registered_Tournaments: string[];
    Tournament_History: string[];
}

export interface Tournaement {
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