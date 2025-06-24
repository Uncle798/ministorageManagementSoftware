import { QSTASH_TOKEN } from "$env/static/private";
import { Client } from "@upstash/workflow";

export const qStash = new Client({
   token: QSTASH_TOKEN, 
})