import { getServerToken } from "@/serverActions/getToken";
import { NextResponse } from 'next/server';


export async function GET() {
    const token = getServerToken();
    if (!token) {
        return NextResponse.json({ error: 'Token not found' }, { status: 404 });
    }
    return NextResponse.json({ token });
}   