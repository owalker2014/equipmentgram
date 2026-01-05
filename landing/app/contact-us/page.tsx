"use client";

import { Button, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

type Props = {};

const ContactUs = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { reset, getInputProps, onSubmit } = useForm({
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
      <section className="bg-gray-100" id="contact">
        <div className="container bg-blue-100x mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10 flex flex-row gap-10 sm:flex-col md:flex-col lg:flex-row">
          <div className="flex flex-col flex-grow" id="contact-us">
            <h2 className="font-heading font-bold tracking-tight text-gray-900 text-3xl sm:text-3xl">
              Get in Touch
            </h2>
            <h4 className="mb-9 mt-0 font-medium text-gray-500">
              Ready to Get Started?
            </h4>
            <form id="contactForm" onSubmit={onSubmit(onSubmitForm)}>
              <div className="mb-6">
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
                <div className="mx-0 mb-1 sm:mb-4">
                  <Textarea
                    placeholder="Your Message"
                    rows={7}
                    cols={30}
                    {...getInputProps("message")}
                  />
                </div>
              </div>
              <Button type="submit" size="md" loading={isLoading}>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
