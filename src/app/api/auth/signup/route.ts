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
  userType: string;
  firstName: string;
  lastName: string;
};
export async function POST(req: Request, res: NextResponse<ResponseData>) {
  try {
    const { user, session } = await validateRequest();
    if (user) throw new Error("Logout to sign up");

    const { password, email, userType, firstName, lastName } = (await req.json()) as RequestData;
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);

    formData.append("userType", userType);

    // Correctly call the login function with two arguments
    const result = await signup(null, formData, true);

    if (result.error) throw new Error(result.error);
    return NextResponse.json({ Success: result.success }, { status: 200 });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
