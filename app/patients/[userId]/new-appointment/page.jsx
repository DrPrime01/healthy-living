import Image from "next/image";

import AppointmentForm from "@/components/form/appointment-form";
import { getPatient } from "@/lib/actions/patients.actions";

export default async function NewAppointment({ params: { userId } }) {
  const patient = await getPatient(userId);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="patient"
            className="mb-12 h-10 w-fit"
          />
        </div>
        <AppointmentForm
          type="create"
          patientId={patient.$id}
          userId={userId}
        />

        <p className="justify-items-end text-dark-600 xl:text-left mt-20">
          &copy; 2024 CarePulse
        </p>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
