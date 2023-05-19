"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const library_1 = require("@prisma/client/runtime/library");
const zod_1 = require("zod");
const zod_error_1 = require("zod-error");
const prismaErrorHandler = (error) => {
    var _a;
    let errorMessage;
    switch (error.code) {
        case "P2002":
            const doubledField = (_a = error.meta) === null || _a === void 0 ? void 0 : _a.target;
            errorMessage = `This ${doubledField} already in used`;
            break;
        case "P2003":
            errorMessage = "Foreign key constraint failed";
            break;
        case "P2025":
            errorMessage = "Record not found";
            break;
        case "P2026":
            errorMessage = "Multiple records found";
            break;
        case "P2027":
            errorMessage = "Null constraint violation";
            break;
        case "P3010":
            errorMessage = "Query parsing error";
            break;
        default:
            errorMessage = "Unknown error has occurred";
            break;
    }
    return errorMessage;
};
const options = {
    transform: ({ errorMessage, index }) => `Error #${index + 1}: ${errorMessage}`,
};
const errorHandler = (error) => {
    let errorMessage;
    let code;
    console.log(error);
    if (error instanceof library_1.PrismaClientKnownRequestError) {
        errorMessage = prismaErrorHandler(error);
        code = 400;
    }
    else if (error instanceof zod_1.ZodError) {
        errorMessage = (0, zod_error_1.generateErrorMessage)(error.issues, options);
        code = 400;
    }
    else {
        console.log(error);
        errorMessage = "An unexpected error occurred";
        code = 500;
    }
    return { errorMessage, code };
};
exports.errorHandler = errorHandler;
