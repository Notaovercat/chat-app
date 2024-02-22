import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { ErrorMessageOptions, generateErrorMessage } from "zod-error";

const prismaErrorHandler = (error: PrismaClientKnownRequestError): string => {
  let errorMessage: string;
  switch (error.code) {
    case "P2002":
      const doubledField: string | unknown = error.meta?.target;
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

const options: ErrorMessageOptions = {
  transform: ({ errorMessage, index }) =>
    `Error #${index + 1}: ${errorMessage}`,
};

export const errorHandler = (
  error: any
): {
  errorMessage: string;
  code: number;
  
} => {
  let errorMessage: string;
  let code: number;
  console.log(error);
  if (error instanceof PrismaClientKnownRequestError) {
    errorMessage = prismaErrorHandler(error);
    code = 400;
  } else if (error instanceof ZodError) {
    errorMessage = generateErrorMessage(error.issues, options);
    code = 400;
  } else {
    console.log(error);
    errorMessage = "An unexpected error occurred";
    code = 500;
  }

  return { errorMessage, code };
};
