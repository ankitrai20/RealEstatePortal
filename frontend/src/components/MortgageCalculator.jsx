import { useMemo, useState } from "react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function MortgageCalculator({ propertyPrice }) {

  const price = Number(propertyPrice) || 0;

  const [downPayment, setDownPayment] = useState(
    Math.min(1000000, price)
  );

  const [interestRate, setInterestRate] = useState(8.5);

  const [loanYears, setLoanYears] = useState(20);

  const {
    loanAmount,
    emi,
    totalAmount,
    totalInterest,
  } = useMemo(() => {

    const principal = Math.max(
      price - Number(downPayment),
      0
    );

    const monthlyRate =
      Number(interestRate) / 12 / 100;

    const months =
      Number(loanYears) * 12;

    let monthlyEMI = 0;

    if (principal === 0) {

      monthlyEMI = 0;

    } else if (monthlyRate === 0) {

      monthlyEMI = principal / months;

    } else {

      monthlyEMI =
        (principal *
          monthlyRate *
          Math.pow(
            1 + monthlyRate,
            months
          )) /
        (Math.pow(
          1 + monthlyRate,
          months
        ) - 1);

    }

    const total = monthlyEMI * months;

    const interest = total - principal;

    return {

      loanAmount: principal,

      emi: monthlyEMI,

      totalAmount: total,

      totalInterest: interest,

    };

  }, [
    price,
    downPayment,
    interestRate,
    loanYears,
  ]);

  const chartData = {
    labels: [
      "Loan Amount",
      "Interest",
    ],

    datasets: [
      {
        data: [
          loanAmount,
          totalInterest,
        ],

        backgroundColor: [
          "#2563eb",
          "#f59e0b",
        ],

        borderWidth: 0,
      },
    ],
  };

  return (

    <div className="mt-14 bg-white rounded-3xl shadow-2xl overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">

        <h2 className="text-4xl font-bold">
          🏦 Mortgage Calculator
        </h2>

        <p className="mt-2 text-blue-100">
          Calculate your monthly EMI instantly.
        </p>

      </div>

      <div className="grid lg:grid-cols-2 gap-10 p-8">

        {/* Left */}

        <div className="space-y-7">

          <div>

            <label className="font-semibold text-gray-700">
              Property Price
            </label>

            <input
              disabled
              value={`₹ ${price.toLocaleString("en-IN")}`}
              className="w-full mt-2 rounded-xl border bg-gray-100 p-4"
            />

          </div>

          <div>

            <div className="flex justify-between">

              <label className="font-semibold">
                Down Payment
              </label>

              <span className="font-bold text-blue-600">
                ₹ {Number(downPayment).toLocaleString("en-IN")}
              </span>

            </div>

            <input
              type="range"
              min="0"
              max={price}
              step="100000"
              value={downPayment}
              onChange={(e) =>
                setDownPayment(Number(e.target.value))
              }
              className="w-full mt-3"
            />

            <input
              type="number"
              value={downPayment}
              onChange={(e) =>
                setDownPayment(Number(e.target.value))
              }
              className="w-full mt-3 border rounded-xl p-3"
            />

          </div>

          <div>

            <div className="flex justify-between">

              <label className="font-semibold">
                Interest Rate
              </label>

              <span className="font-bold text-blue-600">
                {interestRate} %
              </span>

            </div>

            <input
              type="range"
              min="1"
              max="20"
              step="0.1"
              value={interestRate}
              onChange={(e) =>
                setInterestRate(Number(e.target.value))
              }
              className="w-full mt-3"
            />

            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) =>
                setInterestRate(Number(e.target.value))
              }
              className="w-full mt-3 border rounded-xl p-3"
            />

          </div>

          <div>

            <div className="flex justify-between">

              <label className="font-semibold">
                Loan Tenure
              </label>

              <span className="font-bold text-blue-600">
                {loanYears} Years
              </span>

            </div>

            <input
              type="range"
              min="1"
              max="30"
              value={loanYears}
              onChange={(e) =>
                setLoanYears(Number(e.target.value))
              }
              className="w-full mt-3"
            />

            <input
              type="number"
              value={loanYears}
              onChange={(e) =>
                setLoanYears(Number(e.target.value))
              }
              className="w-full mt-3 border rounded-xl p-3"
            />

          </div>

        </div>

        {/* Right */}

        <div>

          <div className="grid grid-cols-2 gap-5">

            <div className="bg-blue-50 rounded-2xl p-5">

              <p className="text-gray-500">
                Loan Amount
              </p>

              <h2 className="text-2xl font-bold text-blue-600 mt-2">
                ₹ {loanAmount.toLocaleString("en-IN")}
              </h2>

            </div>

            <div className="bg-green-50 rounded-2xl p-5">

              <p className="text-gray-500">
                Monthly EMI
              </p>

              <h2 className="text-2xl font-bold text-green-600 mt-2">
                ₹ {Math.round(emi).toLocaleString("en-IN")}
              </h2>

            </div>

            <div className="bg-yellow-50 rounded-2xl p-5">

              <p className="text-gray-500">
                Interest
              </p>

              <h2 className="text-2xl font-bold text-yellow-600 mt-2">
                ₹ {Math.round(totalInterest).toLocaleString("en-IN")}
              </h2>

            </div>

            <div className="bg-red-50 rounded-2xl p-5">

              <p className="text-gray-500">
                Total Payment
              </p>

              <h2 className="text-2xl font-bold text-red-600 mt-2">
                ₹ {Math.round(totalAmount).toLocaleString("en-IN")}
              </h2>

            </div>

          </div>

          <div className="mt-10 h-[320px] flex items-center justify-center">

            <Pie
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,

                plugins: {

                  legend: {

                    position: "bottom",

                    labels: {

                      font: {
                        size: 14,
                      },

                    },

                  },

                },

              }}
            />

          </div>

        </div>

      </div>

    </div>

  );

}

export default MortgageCalculator;