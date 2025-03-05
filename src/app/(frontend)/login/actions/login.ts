"use server"
import {getPayload} from "payload";
import config from "@payload-config";
import {cookies} from "next/headers";
import {Client} from "@/payload-types";




interface LoginParams {
    email: string;
    password: string;
}


interface LoginResponse {
    success: boolean;
    error?: string;
}


export type Result = {
    exp?: number;
    token?: string;
    user?: Client;
}


export async function login({email, password}: LoginParams): Promise<LoginResponse> {

    const payload = await getPayload({config});

    try {
      const result:Result =  await payload.login({
        collection: "clients",
        data: {
            email,  
            password
        }
      });

      if (result.token) {
        const cookieStore = await cookies();
        cookieStore.set("bcos-token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
       });
        return {success: true};
        }else {
            return {success: false, error: "Login failed"}; 
        }

        return {success: true};
    } catch (error) {
        console.error("Login error:", error);
        return {success: false, error: error.message};
    }
}