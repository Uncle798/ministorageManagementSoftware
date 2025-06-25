import { VERCEL_BEARER_TOKEN } from "$env/static/private";
import { Vercel } from "@vercel/sdk";

export const vercelClient = new Vercel({
   bearerToken: VERCEL_BEARER_TOKEN
})