# Backend Error Handling Package Documentation

This documentation provides an overview of the error-handling mechanisms implemented in the backend. It introduces a structured approach for managing errors in an Express.js application, ensuring consistent and efficient error responses.

---

## Key Components

### 1. `ApiResponse` Class

The `ApiResponse` class standardizes the format of all responses sent to the client.

#### Example Usage:

For successful responses:

```typescript
return res.status(200).json(new ApiResponse(200, response, "User Create Successful"));
```

---

### 2. `asyncHandler` Function

The `asyncHandler` function wraps Express.js controller functions, allowing asynchronous errors to be caught and passed to the global error handler without explicitly using `try-catch` blocks in every controller.

#### Example Usage:

```typescript
import { asyncHandler } from "backend-error-handler";

const createUser = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body.data;

    const response = await userService.createUser(data);

    return res.status(200).json(new ApiResponse(200, response, "User Create Successful"));
});

export { createUser };
```

---

### 3. `expressErrorHandler` Function

The `expressErrorHandler` function is the global error handler. It ensures that all errors, regardless of their origin, are handled and sent to the client in a consistent format.

#### Global Middleware Setup:

```typescript
import { expressErrorHandler } from "backend-error-handler";

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    expressErrorHandler(err, req, res, next);
});
```

#### Error Response Format:

All error responses are sent in the following JSON structure:

```json
{
    "status": <HTTP_STATUS_CODE>,
    "data": {
        "message": "Detailed error message",
        "error": "Error details",
        "errors": ["Additional error messages"]
    },
    "isError": true
}
```

---

### 4. `AppError` Class

The `AppError` class provides a structured way to define and throw custom application errors. This supports different types of errors such as database errors, validation errors, and more.

#### Example Usage:

```typescript
import { AppError } from "backend-error-handler";

// Throwing validation errors
throw AppError.zodError("Custom Message",error);

// Throwing MongoDB-specific errors
throw AppError.mongoError("Custom Message", error);

// Throwing Prisma-specific errors
throw AppError.prismaError("Custom Message", error);

// Throwing other types of errors - just pass the message 
throw AppError.badRequest("Invalid request data");
throw AppError.conflict("Resource already exists");
throw AppError.internalServerError("Something went wrong");
throw AppError.notFound("Resource not found");
throw AppError.unauthorized("Access denied");
throw AppError.forbidden("Action forbidden");
```

---

### 5. `trycatchWrapper` Utility Functions

The `trycatchWrapper` family of functions simplifies error handling in different layers of the application (e.g., repository, service). They automatically catch errors and throw appropriate `AppError` instances.

#### Example Usage:

**Standard Wrapper:**

```typescript
import { trycatchWrapper } from "backend-error-handler";

const fetchData = trycatchWrapper(async () => {
    // Your logic here
});
```

**MongoDB-Specific Wrapper:**

```typescript
import { trycatchWrapperMongo } from "backend-error-handler";

const fetchMongoData = trycatchWrapperMongo(async () => {
    // Your MongoDB query here
});
```

**Prisma-Specific Wrapper:**

```typescript
import { trycatchWrapperPrisma } from "backend-error-handler";

const fetchPrismaData = trycatchWrapperPrisma(async () => {
    // Your Prisma query here
});
```

---

## Installation

Install the package via npm:

```bash
npm install backend-error-handler
```

---

## Conclusion

By using the `backend-error-handler` package, you can:

- Simplify error handling in controllers and services.
- Ensure consistent error and success response formats.
- Reduce boilerplate `try-catch` blocks.

For additional questions or support, please refer to the package documentation or reach out to me -> [amirpoudel](https://www.linkedin.com/in/amirpoudel/) .

