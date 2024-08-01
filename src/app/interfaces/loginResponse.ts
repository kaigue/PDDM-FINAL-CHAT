export interface LoginResponse {
    message: string;
    data:    Data;
}

export interface Data {
    id:       number;
    username: string;
    token:    string;
}
