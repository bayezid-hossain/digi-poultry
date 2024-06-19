import { login, signup } from "@/lib/actions/auth/actions";
import { validateRequest } from "@/lib/actions/auth/validate-request";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
type ResponseData = {
  message: string;
};
type RequestData = {
  password: string;
  email: string;
};
export async function POST(req: Request, res: NextResponse<ResponseData>) {
  try {
    const { user, session } = await validateRequest();
    if (user) throw new Error("Already Logged In");
    const { password, email } = (await req.json()) as RequestData;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    // Correctly call the login function with two arguments
    const result = await login(null, formData, true);

    if (result.error) throw new Error(result.error);
    return NextResponse.json({ Success: result.success }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
