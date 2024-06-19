import { login, logout, signup } from "@/lib/actions/auth/actions";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
type ResponseData = {
  message: string;
};
export async function POST(req: Request, res: NextResponse<ResponseData>) {
  try {
    // Correctly call the login function with two arguments
    const result = await logout(undefined, undefined, true);

    if (result.error) throw new Error(result.error);
    return NextResponse.json({ Success: result.success }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
