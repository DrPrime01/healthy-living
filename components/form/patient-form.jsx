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

export default function PatientForm() {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there</h1>
          <p className="text-dark-700">Schedule your first appointment</p>
        </section>
        <CustomFormField
          control={form.control}
          name="name"
          label="Full name"
          type="input"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
          placeholder="John Doe"
        />
        <CustomFormField
          control={form.control}
          name="email"
          label="Email"
          type="input"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
          placeholder="johndoe@prime.com"
        />
        <CustomFormField
          control={form.control}
          name="phone"
          label="Phone number"
          type="phone"
          placeholder="+234 802 289 4950"
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
}
