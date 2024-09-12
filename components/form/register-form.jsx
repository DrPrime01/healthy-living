"use client";
import { useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl } from "@/components/ui/form";
import { useRouter } from "next/navigation";

import { PatientFormValidation } from "@/lib/validation";
import CustomFormField from "../custom-form-field";
import SubmitButton from "../submit-button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import FileUploader from "../file-uploader";
import { registerPatient } from "@/lib/actions/patients.actions";
import { PatientFormDefaultValues } from "@/constants";

export default function RegisterForm({ user }) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      ...PatientFormDefaultValues,
    },
  });

  async function onSubmit(values) {
    console.log(values);
    setIsLoading(true);
    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }
    try {
      const patientData = {
        ...values,
        userid: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };

      console.log(patientData);

      const patient = await registerPatient(patientData);

      if (patient) router.push(`/patients/${user.$id}/new-appointment`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about you.</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
        </div>
        <div className="flex flex-col xl:flex-row gap-6">
          <CustomFormField
            control={form.control}
            name="birthDate"
            label="Date of birth"
            type="date_picker"
            placeholder="johndoe@prime.com"
          />
          <CustomFormField
            control={form.control}
            name="gender"
            label="Gender"
            type="skeleton"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div className="radio-group" key={option}>
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CustomFormField
            control={form.control}
            name="address"
            label="Address"
            type="input"
            placeholder="ex: 14 street, New York, NY - 5101"
          />
          <CustomFormField
            control={form.control}
            name="occupation"
            label="Occupation"
            type="input"
            placeholder="Software Engineer"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <CustomFormField
            control={form.control}
            name="emergencyContactName"
            label="Emergency contact name"
            type="input"
            placeholder="Guardian’s name"
          />
          <CustomFormField
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency contact number"
            type="phone"
            placeholder="+234 802 289 4950"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CustomFormField
            control={form.control}
            name="insuranceProvider"
            label="Insurance provider"
            type="input"
            placeholder="BlueCross"
          />
          <CustomFormField
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance policy number"
            type="input"
            placeholder="ABC123456789"
          />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CustomFormField
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            type="textarea"
            placeholder="Peanut, Penicillin, Pollen"
          />
          <CustomFormField
            control={form.control}
            name="pastMedication"
            label="Past medication (if any)"
            type="textarea"
            placeholder="E.g: Ibuprofen"
          />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <CustomFormField
            control={form.control}
            name="familyMedicalHistory"
            label="Family medical history"
            type="textarea"
            placeholder=""
          />
          <CustomFormField
            control={form.control}
            name="pastMedicalHistory"
            label="Past medical history"
            type="textarea"
            placeholder="E.g: Ibuprofen"
          />
        </div>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          name="identificationType"
          label="Identification type"
          type="select"
          placeholder="Select identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          control={form.control}
          name="identificationNumber"
          label="Identification number"
          type="input"
          placeholder="123456789"
        />
        <CustomFormField
          control={form.control}
          name="identificationDocument"
          label="Scanned copy of identification document"
          type="skeleton"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>
        <CustomFormField
          type="checkbox"
          control={form.control}
          name="treatmentConsent"
          label="I consent to receive treatment for my health condition."
        />
        <CustomFormField
          type="checkbox"
          control={form.control}
          name="disclosureConsent"
          label="I consent to the use and disclosure of my health information for treatment purposes."
        />
        <CustomFormField
          type="checkbox"
          control={form.control}
          name="privacyConsent"
          label="I acknowledge that I have reviewed and agree to the privacy policy"
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
}
