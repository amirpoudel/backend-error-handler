# Backend Error Handling Package Documentation

This documentation provides an overview of the error-handling mechanisms implemented in the backend. It introduces a structured approach for managing errors in an Express.js application, ensuring consistent and efficient error responses.

---

## Key Components

### 1. `ApiResponse` Class

The `ApiResponse` class standardizes the format of all responses sent to the client, whether successful or containing errors.

#### Example Usage:

For successful responses:

```typescript
return res.status(200).json(new ApiResponse(200, response, "User Create Successful"));
```

### 2. `asyncHandler` Function

The `asyncHandler` function wraps Express.js controller functions, allowing asynchronous errors to be caught and passed to the global error handler without explicitly using `try-catch` blocks in every controller.

#### Example Usage:

```typescript
import { asyncHandler } from "../error/asyncHandler";

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
import { AppError } from "../error/app.error";

// Throwing a custom error
throw new AppError.validationError("Invalid input data", { field: "email" });

// Handling a specific error type
if (error instanceof AppError) {
    console.log("Handled AppError: ", error.message);
}
```

---

### 5. `trycatchWrapper` Utility Functions

The `trycatchWrapper` family of functions simplifies error handling in different layers of the application (e.g., repository, service). They automatically catch errors and throw appropriate `AppError` instances.

#### Example Usage:

- **Generic Wrapper:**

  Use for general purposes where no specific error type is required.

  ```typescript
  const wrappedFunction = trycatchWrapper(async () => {
      // Business logic here
  });
  ```

- **MongoDB Wrapper:**

  Automatically wraps and handles MongoDB-specific errors.

  ```typescript
  const wrappedMongoFunction = trycatchWrapperMongo(async () => {
      // MongoDB logic here
  });
  ```

- **Prisma Wrapper:**

  Automatically wraps and handles Prisma-specific errors.

  ```typescript
  const wrappedPrismaFunction = trycatchWrapperPrisma(async () => {
      // Prisma logic here
  });
  ```

---

## Benefits

1. **Consistency:** All errors are formatted and sent in a standardized structure.
2. **Efficiency:** Reduces boilerplate `try-catch` blocks in controllers and service layers.
3. **Flexibility:** Custom `AppError` classes support diverse error types.
4. **Scalability:** Wrapper functions allow easy integration with various data sources (e.g., MongoDB, Prisma).

---

## Summary of Implementation Steps

1. **Setup the `ApiResponse` class** for standardized success and error responses.
2. **Use the `asyncHandler` wrapper** for all Express.js controllers.
3. **Define the `AppError` class** to handle custom errors.
4. **Implement the `trycatchWrapper` utility functions** for different layers (repository, service).
5. **Configure the `expressErrorHandler`** as the global error middleware in `app.ts`/`app.js`.

---

## Example Application Flow

1. A controller function is wrapped with `asyncHandler`.
2. Errors thrown in the controller are automatically passed to the `expressErrorHandler`.
3. Service/repository layers use `trycatchWrapper` to handle errors and rethrow as `AppError` instances.
4. The `expressErrorHandler` sends a formatted response to the client.

---

This package streamlines error management in the backend, ensuring reliability and simplicity across all layers of the application.

