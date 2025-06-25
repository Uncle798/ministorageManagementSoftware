import { NEON_API_KEY } from "$env/static/private";
import { createApiClient } from "@neondatabase/api-client";

export const neonClient = createApiClient({
   apiKey: NEON_API_KEY
})