import React from "react";

type HowItWorksSectionProps = {
  isLanding?: boolean;
};

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  isLanding = false,
}) => {
  return (
    <section
      className={`${isLanding ? "bg-blue-50" : "bg-white"} py-10`}
      id="how-it-works"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">How It Works</h2>
          <p className="text-gray-600 mb-12">
            Below are the steps for generating an inspection report by anyone
            using their tablet or smartphone.
          </p>
        </div>
        <div className="flex flex-wrap -mx-4 mt-12">
          <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 px-4 mb-8">
            <div className="rounded-md bg-white shadow-md p-8">
              <div className="text-4xl font-bold text-blue-700 mb-4">01</div>
              {/* <h3 className="text-2xl font-bold mb-4">Feature 1</h3> */}
              <img
                src="how-it-works-1.png"
                alt="how-it-works-1"
                className="max-w-full lg:ml-auto rounded-lg"
              />
            </div>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 px-4 mb-8">
            <div className="rounded-md bg-white shadow-md p-8">
              <div className="text-4xl font-bold text-blue-700 mb-4">02</div>
              {/* <h3 className="text-2xl font-bold mb-4">Feature 2</h3> */}
              <img
                src="how-it-works-2.png"
                alt="how-it-works-2"
                className="max-w-full lg:ml-auto rounded-lg"
              />
            </div>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 px-4 mb-8">
            <div className="rounded-md bg-white shadow-md p-8">
              <div className="text-4xl font-bold text-blue-700 mb-4">03</div>
              {/* <h3 className="text-2xl font-bold mb-4">Feature 3</h3> */}
              <img
                src="how-it-works-3.png"
                alt="how-it-works-3"
                className="max-w-full lg:ml-auto rounded-lg"
              />
            </div>
          </div>

          <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 px-4 mb-8">
            <div className="rounded-md bg-white shadow-md p-8">
              <div className="text-4xl font-bold text-blue-700 mb-4">04</div>
              {/* <h3 className="text-2xl font-bold mb-4">Feature 4</h3> */}
              <img
                src="how-it-works-4.png"
                alt="how-it-works-4"
                className="max-w-full lg:ml-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
