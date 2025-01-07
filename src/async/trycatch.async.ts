import { AppError } from "../error/app.error";

export const trycatchWrapper = function (fn: Function) {
    return async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (error) {
            throw error;
        }
    }
};

export const trycatchWrapperMongo = function (fn: Function) {
    return async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (error) {
            throw AppError.mongoError("Mongo Error", error);    
        }
    }
}


export const trycatchWrapperPrisma = function (fn: Function) {
    return async (...args: any[]) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.log("Prisma Error:", error);
            throw AppError.prismaError("Prisma Error", error);    
        }
    }
}

