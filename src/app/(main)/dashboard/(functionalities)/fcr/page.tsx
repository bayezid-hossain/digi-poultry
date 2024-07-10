import { Paths } from "@/lib/constants";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-4xl font-bold">Welcome to Your Daily FCR Calculation Hub</h1>
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">
          Enhance Your Poultry Farm's Efficiency and Profitability
        </h2>
        <p className="mb-4">
          Welcome to our comprehensive platform designed to help poultry farmers easily calculate
          and monitor the Feed Conversion Ratio (FCR) of their flocks. Efficient feed conversion is
          crucial for the profitability and sustainability of your poultry farm. Our tools and
          resources will guide you through accurate daily FCR calculations to optimize feed usage
          and improve bird health.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Why Daily FCR Calculation Matters</h2>
        <ul className="list-inside list-disc">
          <li className="mb-2">
            Improved Efficiency: Daily tracking of FCR allows you to make timely adjustments to
            feeding practices and management, ensuring optimal feed efficiency.
          </li>
          <li className="mb-2">
            Cost Management: By closely monitoring FCR, you can better manage feed costs, which are
            a significant portion of your operational expenses.
          </li>
          <li className="mb-2">
            Health Monitoring: Daily FCR calculations can help detect early signs of health issues,
            allowing for prompt interventions.
          </li>
          <li className="mb-2">
            Sustainability: Efficient feed conversion reduces waste and lowers the environmental
            impact of your poultry farming operations.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">How to Calculate FCR</h2>
        <p className="mb-4">
          FCR is a simple yet powerful metric that measures the efficiency of your birds in
          converting feed into body mass. The formula is:
        </p>
        <p className="mb-4 rounded bg-input p-4 text-white">
          FCR = Total Feed Consumed (kg) / Total Weight Gain (kg)
        </p>
        <h3 className="mb-2 text-xl font-semibold">Steps to Calculate Daily FCR:</h3>
        <ol className="mb-4 list-inside list-decimal">
          <li className="mb-2">
            Measure Total Feed Consumed: Record the total amount of feed given to your birds each
            day.
          </li>
          <li className="mb-2">
            Measure Total Weight Gain: Weigh your birds at the start and end of the day to calculate
            the weight gain.
          </li>
        </ol>
        <h3 className="mb-2 text-xl font-semibold">Example Calculation:</h3>
        <p className="mb-4 flex-wrap rounded bg-input p-4 text-white">
          Let's say today: - Total feed consumed by 100 birds: 100 kg <br />- Initial weight of 100
          birds: 2,500 kg <br />- Final weight of 100 birds: 2,600 kg Total <br />
          Weight Gain = Final Weight - Initial Weight Total <br />
          Weight Gain = 2,600 kg - 2,500 kg Total <br />
          Weight Gain = 100 kg <br />
          FCR = Total Feed Consumed / Total Weight Gain <br />
          FCR = 100 kg / 100 kg
          <br /> FCR = 1.0
        </p>
      </section>
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold">Tools and Resources</h2>
        <ul className="list-inside list-disc">
          <li className="mb-2">
            FCR Calculator: An easy-to-use tool to quickly calculate daily FCR.
          </li>
          <li className="mb-2">
            Data Management: Keep track of daily feed consumption and weight gain data.
          </li>
          <li className="mb-2">
            Reports and Analytics: Generate reports to analyze trends and make data-driven
            decisions.
          </li>
          <li className="mb-2">
            Expert Tips: Access expert advice on improving feed efficiency and bird health.
          </li>
        </ul>
      </section>
      <section className="text-center">
        <Link href={Paths.NewFCR}>
          <p className="rounded bg-primary px-6 py-3 font-bold text-primary-foreground hover:bg-accent hover:text-accent-foreground">
            Calculate Your Daily FCR Now
          </p>
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
