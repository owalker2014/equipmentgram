import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EquipmentGram - Contact Sales",
};

type Props = {};

const ContactSales = () => {
  return (
    <>
      <section id="contact" style={{ display: "block" }}>
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div id="calendly-sales">
            <h2 className="font-heading font-bold tracking-tight text-gray-900 text-3xl sm:text-3xl">
              Let's Talk
            </h2>
            <h4 className="mb-5 mt-0 font-medium text-gray-500">
              Schedule a meeting with a Sales Executive
            </h4>
            <div
              className="calendly-inline-widget min-w-[320px] w-full h-[675px]"
              data-url="https://calendly.com/tobiwalker2014/30min?hide_event_type_details=1&hide_gdpr_banner=1"
            ></div>
            <script
              type="text/javascript"
              src="https://assets.calendly.com/assets/external/widget.js"
              async
            ></script>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSales;
