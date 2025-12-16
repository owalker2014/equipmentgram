"use client";

import { HowItWorksSection } from "@/components/sections/how-it-works";
import { Button, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

type Props = {};

const ContactUs = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { reset, getInputProps, onSubmit, onReset } = useForm({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmitForm = async (data: any) => {
    setIsLoading(true);
    try {
      await fetch("/api/contact-us", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
        }),
      });

      notifications.show({
        title: "Contact us message sent successfully",
        message: " We will get back to you soon",
        color: "teal",
      });

      setIsLoading(false);
    } catch (error) {
      notifications.show({
        title: "Contact us message failed",
        message: "Message failed to send",
        color: "red",
      });
      setIsLoading(false);
    } finally {
      reset();
    }
  };

  return (
    <>
      <HowItWorksSection />
      <section className="bg-gray-100" id="contact">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-4">
            <div className="mb-3 max-w-3xl text-center sm:text-center md:mx-auto md:mb-3">
              {/* <p className="text-base font-semibold uppercase tracking-wide text-blue-600 ">
                Contact
              </p> */}
              <h4 className="font-heading mb-4 font-bold tracking-tight text-gray-900 text-3xl sm:text-3xl">
                Get in Touch
              </h4>
            </div>
          </div>
          <div className="flex items-stretch justify-center">
            <div className="flex">
              <div
                className="card min-w-[600px] h-fit max-w-6xl p-5 md:p-5"
                id="form"
              >
                <h2 className="mb-4 text-xl text-center font-bold">
                  Ready to Get Started?
                </h2>
                <form id="contactForm" onSubmit={onSubmit(onSubmitForm)}>
                  <div className="mb-6">
                    <div className="mx-0 mb-1 sm:mb-4">
                      <div className="mx-0 mb-1 sm:mb-4">
                        <TextInput
                          placeholder="Your Name"
                          {...getInputProps("name")}
                        />
                      </div>
                      <div className="mx-0 mb-1 sm:mb-4">
                        <TextInput
                          placeholder="Your Email"
                          type="email"
                          {...getInputProps("email")}
                        />
                      </div>
                      <div className="mx-0 mb-1 sm:mb-4">
                        <TextInput
                          placeholder="Your Phone"
                          type="tel"
                          {...getInputProps("phone")}
                        />
                      </div>
                    </div>
                    <div className="mx-0 mb-1 sm:mb-4">
                      <Textarea
                        placeholder="Your Message"
                        rows={5}
                        cols={30}
                        {...getInputProps("message")}
                      />
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      type="submit"
                      fullWidth
                      size="md"
                      loading={isLoading}
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
