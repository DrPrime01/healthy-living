import RegisterForm from "@/components/form/register-form";
import Image from "next/image";
import Link from "next/link";

import { getUser } from "@/lib/actions/patients.actions";

export default async function Register({ params: { userId } }) {
  const user = await getUser(userId);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
          <RegisterForm user={user} />
          <p className="justify-items-end text-dark-600 xl:text-left mt-20">
            &copy; 2024 CarePulse
          </p>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
}
