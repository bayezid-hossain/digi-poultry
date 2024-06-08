import { login, logout, signup } from "@/lib/auth/actions";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
type ResponseData = {
  message: string;
};
export async function POST(req: Request, res: NextResponse<ResponseData>) {
  try {
    // Correctly call the login function with two arguments
    const result = await logout(true);

    if (result.error) throw new Error(result.error);
    return NextResponse.json({ Success: result.success }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
