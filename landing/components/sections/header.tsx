import { Button } from "@mantine/core";
import Link from "next/link";

type Props = {};

const Header = ({}) => {
  return (
    <div className="container mx-auto max-w-7xl">
      <div className="relative bg-white pt-[120px] pb-[110px] lg:pt-[150px]">
        <div className="flex flex-wrap">
          <div className="w-full px-4 lg:w-5/12">
            <div className="hero-content">
              <h1 className="text-dark mb-3 text-4xl font-bold leading-snug sm:text-[42px] lg:text-[40px] xl:text-[42px]">
                Streamline Your Heavy Equipment Inspections and Accounting
              </h1>
              <p className="mb-8 text-base">
                EquipmentGram improves the buying and selling experience for
                buyers and sellers of construction equipment with the use of
                equipment inspection reports that can be easily managed and
                distributed by buyers and sellers for different purposes
              </p>
              <div className="grid md:grid-cols-2 grid-cols-1 justify-items-stretch">
                <div>
                  <Link href="/signup">
                    <Button size="lg" fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                </div>
                <div>
                  <Link href="/faq">
                    <Button
                      fullWidth
                      size="lg"
                      variant="white"
                      leftSection={
                        <span className="mr-2">
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="11" cy="11" r="11" fill="#3056D3" />
                          </svg>
                        </span>
                      }
                    >
                      Read Our FAQ
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden px-4 lg:block lg:w-1/12"></div>
          <div className="w-full px-4 lg:w-6/12 overflow-hidden">
            <div className="lg:ml-auto lg:text-right">
              <div className="relative z-10 inline-block pt-11 lg:pt-0">
                <img
                  src="inspector.jpg"
                  alt="hero"
                  className="max-w-full lg:ml-auto rounded-tl-[100px] rounded-lg"
                />
                <span className="absolute -left-8 -bottom-8 z-[-1]">
                  <svg
                    width="93"
                    height="93"
                    viewBox="0 0 93 93"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="2.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="2.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="2.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="2.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="2.5" cy="90.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="24.5" cy="90.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="46.5" cy="90.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="68.5" cy="90.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="2.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="24.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="46.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="68.5" r="2.5" fill="#3056D3" />
                    <circle cx="90.5" cy="90.5" r="2.5" fill="#3056D3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">How It Works</h2>
            <p className="text-gray-600 mb-12">
              Below are the steps for generating an inspection report by anyone
              using their tablet or smartphone.
            </p>
          </div>
          <div className="flex flex-wrap -mx-4 mt-12">
            <div className="w-full md:w-1/4 px-4 mb-8">
              <div className="rounded-md bg-white shadow-md p-8">
                <div className="text-4xl font-bold text-blue-700 mb-4">01</div>
                {/* <h3 className="text-2xl font-bold mb-4">Feature 1</h3> */}
                <img
                  src="how-it-works-1.png"
                  alt="how-it-works-1"
                  className="max-w-full lg:ml-auto rounded-tl-[100px] rounded-lg"
                />
              </div>
            </div>
            <div className="w-full md:w-1/4 px-4 mb-8">
              <div className="rounded-md bg-white shadow-md p-8">
                <div className="text-4xl font-bold text-blue-700 mb-4">02</div>
                {/* <h3 className="text-2xl font-bold mb-4">Feature 2</h3> */}
                <img
                  src="how-it-works-2.png"
                  alt="how-it-works-2"
                  className="max-w-full lg:ml-auto rounded-tl-[100px] rounded-lg"
                />
              </div>
            </div>

            <div className="w-full md:w-1/4 px-4 mb-8">
              <div className="rounded-md bg-white shadow-md p-8">
                <div className="text-4xl font-bold text-blue-700 mb-4">03</div>
                {/* <h3 className="text-2xl font-bold mb-4">Feature 3</h3> */}
                <img
                  src="how-it-works-3.png"
                  alt="how-it-works-3"
                  className="max-w-full lg:ml-auto rounded-tl-[100px] rounded-lg"
                />
              </div>
            </div>

            <div className="w-full md:w-1/4 px-4 mb-8">
              <div className="rounded-md bg-white shadow-md p-8">
                <div className="text-4xl font-bold text-blue-700 mb-4">04</div>
                {/* <h3 className="text-2xl font-bold mb-4">Feature 4</h3> */}
                <img
                  src="how-it-works-4.png"
                  alt="how-it-works-4"
                  className="max-w-full lg:ml-auto rounded-tl-[100px] rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Header;
