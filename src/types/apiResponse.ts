import { ContentType } from "@/models/Content";

export interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        content?: ContentType
    };
}

export interface APIError {
    error: string;
    message?: string;
    stack?: string;
}