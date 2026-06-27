import { Content } from ".";

export interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        content?: Content
    };
}

export interface APIError {
    error: string;
    message?: string;
    stack?: string;
}