import { login, signup, verifyEmail } from "@/lib/auth/actions";
import { validateRequest } from "@/lib/auth/validate-request";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
type ResponseData = {
  message: string;
};
type RequestData = {
  code: string;
};
export async function POST(req: Request, res: NextResponse<ResponseData>) {
  try {
    const { user, session } = await validateRequest();
    if (session?.isUserVerified) throw new Error("Already Logged In");
    const { code } = (await req.json()) as RequestData;
    const formData = new FormData();
    formData.append("code", code);

    // Correctly call the login function with two arguments
    const result = await verifyEmail(null, formData, true);

    if (result.error) throw new Error(result.error);
    return NextResponse.json({ Success: result.success }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
