import { login, signup } from "@/lib/auth/actions";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
type ResponseData = {
  message: string;
};
export async function POST(req: Request, res: NextResponse<ResponseData>) {
  try {
    const { password, email } = await req.json();
    var formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    // Correctly call the login function with two arguments
    const result = await login(null, formData, true);

    if (result.error) throw new Error(result.error);
    return NextResponse.json({ Success: result.success }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message }, { status: 500 });
  }
}
