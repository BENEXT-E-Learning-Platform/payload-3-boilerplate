"use server"
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Client } from "@/payload-types";


// add logs
export async function getClient(): Promise<Client | null> {
    console.log("getClient")
  const headers = await getHeaders();
    
  const payload: Payload = await getPayload({ config: await configPromise });
    
  const {client} = await payload.auth({ headers });
  return client || null;
}

export default getClient;