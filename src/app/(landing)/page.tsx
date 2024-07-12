import Link from "next/link";
import { type Metadata } from "next";
import { PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { CopyToClipboard } from "./_components/copy-to-clipboard";
import {
  Drizzle,
  LuciaAuth,
  NextjsLight,
  NextjsDark,
  ReactJs,
  ShadcnUi,
  TRPC,
  TailwindCss,
  ReactEmail,
} from "./_components/feature-icons";
import CardSpotlight from "./_components/hover-card";
import { Router } from "next/router";
import { validateRequest } from "@/lib/actions/auth/validate-request";
import { Paths } from "@/lib/constants";
import { redirect } from "next/navigation";
import { CardHeader } from "@/components/ui/card";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Digital Poultry Solutions",
  description: "Solve all your needs and calculation here",
};

const Page = async () => {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);
  return (
    <div className="container mx-auto p-6">
      <header className="py-10 text-center">
        <h1 className="text-5xl font-bold">Welcome to Digi Poultry</h1>
        <p className="mt-4 text-lg">Revolutionizing Poultry Farming with Smart Management</p>{" "}
        <CardHeader className="items-center justify-center p-2">
          {" "}
          <Image
            src={"/assets/logo.jpg"}
            width={150}
            height={150}
            quality={100}
            className="rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10"
            alt="logo"
          />
        </CardHeader>
      </header>

      <section className="my-10">
        <h2 className="mb-6 text-3xl font-bold">Key Features</h2>
        <div className="space-y-2">
          <Feature
            title="Create Your Organization"
            description="Establish your own digital poultry farm organization with ease. Manage all aspects of your operations from a centralized platform tailored to meet the unique needs of poultry farmers."
          />
          <Feature
            title="Invite Team Members"
            description="Collaborate seamlessly by inviting team members to join your organization. Assign roles, share responsibilities, and work together to achieve your farming goals."
          />
          <Feature
            title="Cycle Management"
            description="Create and manage production cycles within your organization. Track every stage of the cycle from start to finish, ensuring optimal performance and efficiency."
          />
          <Feature
            title="Investor Access"
            description="Invite investors to observe your cycles and showcase your farm's progress. Provide them with real-time data and insights, fostering transparency and trust."
          />
          <Feature
            title="Daily FCR Calculation"
            description="Easily calculate and maintain your daily Feed Conversion Ratio (FCR). Monitor feed efficiency to improve productivity and reduce costs."
          />
          <Feature
            title="Comprehensive Data Storage"
            description="Store all your farm data securely in one place. From feed usage and health records to financial transactions and performance metrics, Digi Poultry keeps everything organized and accessible."
          />
          <Feature
            title="Billing and Invoicing"
            description="Automate your billing processes and generate accurate invoices effortlessly. Keep track of expenses and revenues to ensure your farm's financial health."
          />
        </div>
      </section>
      <section className="my-10">
        <h2 className="mb-6 text-3xl font-bold">Why Choose Digi Poultry?</h2>
        <ul className="list-inside list-disc space-y-2 text-lg">
          <li>
            <span className="font-bold">User-Friendly Interface:</span> Our intuitive platform makes
            it easy for anyone to navigate and utilize our powerful tools.
          </li>
          <li>
            <span className="font-bold">Real-Time Insights:</span> Make informed decisions with
            real-time data and analytics at your fingertips.
          </li>
          <li>
            <span className="font-bold">Scalable Solutions:</span> Whether you have a small farm or
            a large operation, Digi Poultry scales with your needs.
          </li>
          <li>
            <span className="font-bold">Secure and Reliable:</span> Your data's security is our top
            priority. We ensure your information is protected and always available when you need it.
          </li>
        </ul>
        <p className="mt-6 text-lg">
          Transform your poultry farm with Digi Poultry. Experience the future of farming today!
        </p>
      </section>
      <section className="my-10 flex flex-col items-center justify-center gap-y-2 text-center">
        <h2 className="text-3xl font-bold">Get Started Today</h2>
        <p className=" text-lg">
          Join Digi Poultry and take the first step towards modernizing your poultry farming
          operations. Whether you're a seasoned farmer or just getting started, our platform is
          designed to support your growth and success.
        </p>
        {user ? (
          <Button
            asChild
            variant={"outlineLink"}
            className="flex h-full w-fit flex-col items-center justify-center p-4 text-xl underline"
          >
            <Link href={Paths.FCR} className="p-4">
              Dashboard
            </Link>
          </Button>
        ) : (
          <div className="ml-auto hidden gap-x-4 sm:flex">
            <Button asChild variant={"outlineLink"}>
              <Link href={Paths.Login}>Login</Link>
            </Button>
            <Button asChild variant={"outlineLink"} className="mr-2">
              <Link href={Paths.Signup}>Sign Up</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

const Feature = ({ title, description }: { title: string; description: string }) => (
  <div>
    <h3 className="text-xl font-semibold underline underline-offset-4">{title}</h3>
    <p className="mt-1 text-lg">{description}</p>
  </div>
);

export default Page;
