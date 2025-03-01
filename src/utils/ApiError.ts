// src/utils/APIError.ts

class APIError extends Error {
    statusCode: number;
    data: null;
    success: boolean;
    errors: any[];

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        error: any[] = [],
        stack: string = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = error;

        if (stack) {
            this.stack = stack;
        } else {
            (Error as any).captureStackTrace(this, this.constructor);
        }
    }
}

export { APIError };