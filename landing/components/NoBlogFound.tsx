import Image from "next/image";

const NoBlogFound = () => {
  return (
    <div className="container px-4 mx-auto max-w-screen-xl">
      <section className="flex items-center justify-center py-2 bg-gray">
        <div className="container mx-auto">
          <div className="mx-auto max-w-[600px] rounded-[10px] bg-white p-10 text-center shadow-card md:py-[55px] md:px-[70px]">
            <div className="mx-auto text-center mb-14">
              <Image src="/schedule.svg" alt="Schedule image" width={400} height={300} style={{ width: "100%", height: "auto" }} />
            </div>
            <h2 className="mb-3 text-2xl font-semibold text-black sm:text-3xl">There are no articles to display.</h2>
            <p className="mb-5 text-base text-body-color">
              We are sorry but there are no articles to display at this time. Please check back later.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NoBlogFound;
