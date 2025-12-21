export interface ErrorCustomVS extends Error {
    custom_message?: string;
    custom_status?: number;
    code?: string;
    cause?: {
        code?: string;
    };
};

export interface ErrorResponseVS {
    error: string;
    type: string;
};