import { Response } from 'express';

export interface SuccessResponse<T> {
    status: 'success';
    successCode: number;
    message: string;
    data: T;
    ticketDetails?: {
        ticketId: string;
        status: string;
    };
    timestamp?: string;
    requestId?: string;
    meta?: Record<string, unknown>;
}

export interface ErrorResponse {
    status: 'error';
    errorCode: number;
    message: string;
    errors: any[];
    timestamp?: string;
    requestId?: string;
}

export function sendSuccess<T>(
    res: Response,
    message: string,
    data: T,
    statusCode = 200,
    requestId?: string,
    meta?: Record<string, unknown>,
    ticketDetails?: { ticketId: string; status: string }
) {
    const response: SuccessResponse<T> = {
        status: 'success',
        successCode: statusCode,
        message,
        data,
        timestamp: new Date().toISOString(),
        requestId,
    };
    if (meta) response.meta = meta;
    if (ticketDetails) response.ticketDetails = ticketDetails;

    return res.status(statusCode).json(response);
}

export function sendError(
    res: Response,
    message: string,
    errors: any[] = [],
    statusCode = 500,
    requestId?: string
) {
    const response: ErrorResponse = {
        status: 'error',
        errorCode: statusCode,
        message,
        errors,
        timestamp: new Date().toISOString(),
        requestId,
    };

    return res.status(statusCode).json(response);
}