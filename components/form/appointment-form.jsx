"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";

import { UserFormValidation } from "@/lib/validation";
import CustomFormField from "../custom-form-field";
import SubmitButton from "../submit-button";
import { createUser } from "@/lib/actions/patients.actions";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { Doctors } from "@/constants";

export default function AppointmentForm({ patientId, userId, type }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  async function onSubmit({ name, email, phone }) {
    console.log(name, email, phone);
    setIsLoading(true);

    try {
      const userData = { name, email, phone };
      const user = await createUser(userData);
      if (user) router.push(`/patients/${user.$id}/register`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  let buttonLabel;
  switch (type) {
    case "cancel":
      buttonLabel = "Cancel Appointment";
      break;
    case "schedule":
      buttonLabel = "Schedule Appointment";
      break;
    default:
      buttonLabel = "Create Apppointment";
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment</h1>
          <p className="text-dark-700">
            Request a new appointment in 10 seconds
          </p>
        </section>
        {type !== "cancel" && (
          <>
            <CustomFormField
              control={form.control}
              name="primaryPhysician"
              label="Primary Physician"
              type="select"
              placeholder="Select a physician"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.name}
                      className="rounded-full border border-dark-500"
                    />
                    <p className="">{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>

            <CustomFormField
              type="date_picker"
              control={form.control}
              name="schedule"
              lable="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyy - h:mm aa"
              placeholder="Select your appointment date"
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <CustomFormField
                control={form.control}
                name="reason"
                label="Reason for appointment"
                type="textarea"
                placeholder="ex: Annual montly check-up"
              />
              <CustomFormField
                control={form.control}
                name="notes"
                label="Additional comments/notes"
                type="textarea"
                placeholder="ex: Prefer afternoon appointments, if possible"
              />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            type="textarea"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === "cancel" ? "shad-danger-btn" : "shad-primary-btn"
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
}
