"use server";

import { connectOrderDB, Order } from "@repo/order-db";
import { auth } from "@clerk/nextjs/server";

interface CreateOrderParams {
    products: {
        id: number;
        name: string;
        price: number;
        quantity: number;
        selectedSize?: string;
        selectedColor?: string;
    }[];
    amount: number;
    shippingAddress: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
    };
    paymentMethod: string;
    paymentId: string;
    status: "success" | "failed" | "pending" | "processing";
}

export async function createOrder(data: CreateOrderParams) {
    try {
        const { userId, getToken } = await auth();

        if (!userId) {
            throw new Error("Unauthorized");
        }

        const token = await getToken();
        const orderServiceUrl = process.env.ORDER_SERVICE_URL || "http://127.0.0.1:8005";

        console.log("Creating order via service:", orderServiceUrl);

        let response;
        try {
            response = await fetch(`${orderServiceUrl}/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...data,
                    userId,
                }),
                signal: AbortSignal.timeout(10000),
            });
        } catch (fetchError) {
            console.error("Fetch network error:", fetchError);
            throw new Error(`fetch failed - ${fetchError instanceof Error ? fetchError.message : "Network error"}`);
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Service error: ${response.status}`);
        }

        const newOrder = await response.json();

        return { success: true, orderId: newOrder._id.toString() };
    } catch (error) {
        console.error("Failed to create order:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
}

export async function getUserOrders() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return [];
        }

        await connectOrderDB();

        const ordersData = await (Order as any).find({ userId }).sort({ createdAt: -1 });
        const orders = JSON.parse(JSON.stringify(ordersData));

        return orders.map((order: any) => ({
            ...order,
            _id: order._id.toString(),
            createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
            updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : order.updatedAt,
            products: order.products.map((product: any) => ({
                ...product,
                _id: product._id ? product._id.toString() : undefined,
            })),
        }));
    } catch (error) {
        console.error("Failed to fetch user orders:", error);
        return [];
    }
}

export async function getOrderById(orderId: string) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return null;
        }

        await connectOrderDB();

        const orderData = await (Order as any).findOne({ _id: orderId, userId });
        const order = JSON.parse(JSON.stringify(orderData));

        if (!order) {
            return null;
        }

        return {
            ...order,
            _id: order._id.toString(),
            createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt,
            updatedAt: order.updatedAt instanceof Date ? order.updatedAt.toISOString() : order.updatedAt,
            products: order.products.map((product: any) => ({
                ...product,
                _id: product._id ? product._id.toString() : undefined,
            })),
        };
    } catch (error) {
        console.error("Failed to fetch order:", error);
        return null;
    }
}
