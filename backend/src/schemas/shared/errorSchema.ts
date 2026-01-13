export interface ErrorCustomVS extends Error {
    custom_message?: string;
    status?: number;
    code?: string;
    cause?: {
        code?: string;
    };
};

export interface ErrorResponseVS {
    error: string;
    type: string;
    issues?: ErrorIssue[]
};

export interface ErrorIssue {
    field: string;
    message: string;
}

export type ErrorTypeVS =
    | 'VS_VALIDATION'
    | 'VS_UNAUTHORIZED'
    | 'VS_NOT_FOUND'
    | 'VS_CONFLICT'
    | 'VS_INVALID'
    | 'VS_MANY_REQUESTS'
    | 'VS_SERVER_ERROR'
    | 'VS_DB_UNAVAILABLE'
    | 'VS_AUTH_REQUIRED'
    | 'VS_AUTH_INVALID'
    | 'VS_AUTH_EXPIRED'