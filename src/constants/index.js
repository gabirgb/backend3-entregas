export const USER_ROLES = Object.freeze({
    ADMIN: 'ADMIN',
    USER: 'USER',
    DELIVERY: 'DELIVERY',
});

export const PRODUCT_STATUS = Object.freeze({
    AVAILABLE: 'AVAILABLE',
    OUT_OF_STOCK: 'OUT_OF_STOCK',
    DISCONTINUED: 'DISCONTINUED',
});

export const ORDER_STATUS = Object.freeze({
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    SHIPPED: 'SHIPPED',
    DELIVERED: 'DELIVERED',
    CANCELLED: 'CANCELLED',
});

export const ORDER_PRIORITY = Object.freeze({
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    URGENT: 'URGENT',
});

export const DELIVERY_STATUS = Object.freeze({
    ASSIGNED: 'ASSIGNED',
    IN_TRANSIT: 'IN_TRANSIT',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
});

export const HTTP_STATUS = Object.freeze({
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
});