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
};