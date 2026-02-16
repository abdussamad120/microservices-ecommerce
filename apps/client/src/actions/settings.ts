"use server";

import { prisma } from "@repo/product-db";

export async function getSettings() {
    try {
        // Find the first settings record or create default
        let settings = await prisma.settings.findFirst();

        if (!settings) {
            return null;
        }

        return settings;
    } catch (error) {
        console.error("Failed to fetch settings:", error);
        return null;
    }
}
