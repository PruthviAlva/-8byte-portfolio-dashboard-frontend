"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SectorPieChart from "@/components/SectorPieChart";

interface Stock {
  symbol: string;
  name: string;
  sector: string;
  exchange: string;
  purchasePrice: number;
  quantity: number;
  cmp: number;
  investment: number;
  presentValue: number;
  gainLoss: number;
  portfolioWeight: number;
  peRatio: string;
  earnings: string;
}

interface PortfolioResponse {
  summary?: {
    totalInvestment?: number;
    totalPresentValue?: number;
    totalGainLoss?: number;
  };
  stocks?: Stock[];
  sectorSummary?: any;
}

export default function Home() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [error, setError] = useState<string>("");

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get("https://eightbyte-portfolio-dashboard-backend.onrender.com/api/portfolio");
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch portfolio data");
    }
  };

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 15000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading Portfolio...
      </div>
    );
  }

  // ✅ Safe default summary values
  const summary = {
    totalInvestment: data.summary?.totalInvestment ?? 0,
    totalPresentValue: data.summary?.totalPresentValue ?? 0,
    totalGainLoss: data.summary?.totalGainLoss ?? 0,
  };

  const sectorSummary = data.sectorSummary ?? {};

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Portfolio Dashboard
        </h1>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Total Investment</h3>
            <p className="text-2xl font-semibold text-gray-600">
              ₹ {summary.totalInvestment.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-500">Total Present Value</h3>
            <p className="text-2xl font-semibold text-gray-600">
              ₹ {summary.totalPresentValue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-gray-600">Total Gain / Loss</h3>
            <p
              className={`text-2xl font-semibold ${
                summary.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹ {summary.totalGainLoss.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Portfolio Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm text-gray-800">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Stock</th>
                <th className="px-4 py-3 text-left">Qty</th>
                <th className="px-4 py-3 text-left">CMP</th>
                <th className="px-4 py-3 text-left">Investment</th>
                <th className="px-4 py-3 text-left">Portfolio %</th>
                <th className="px-4 py-3 text-left">Present Value</th>
                <th className="px-4 py-3 text-left">Gain/Loss</th>
                <th className="px-4 py-3 text-left">P/E</th>
                <th className="px-4 py-3 text-left">Earnings</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(sectorSummary).map(
                ([sector, sectorData]: any) => (
                  <>
                    {/* Sector Header */}
                    <tr
                      key={sector}
                      className="bg-blue-50 text-blue-900 font-bold"
                    >
                      <td colSpan={9} className="px-4 py-3">
                        {sector}
                      </td>
                    </tr>

                    {/* Stocks */}
                    {sectorData.stocks?.map((stock: Stock) => (
                      <tr
                        key={stock.symbol}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium">{stock.name}</td>
                        <td className="px-4 py-3">{stock.quantity}</td>
                        <td className="px-4 py-3">₹ {stock.cmp}</td>
                        <td className="px-4 py-3">₹ {stock.investment}</td>
                        <td className="px-4 py-3">{stock.portfolioWeight}%</td>
                        <td className="px-4 py-3">₹ {stock.presentValue}</td>
                        <td
                          className={`px-4 py-3 font-semibold ${
                            stock.gainLoss >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          ₹ {stock.gainLoss.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">{stock.peRatio}</td>
                        <td className="px-4 py-3">{stock.earnings}</td>
                      </tr>
                    ))}

                    {/* Sector Totals */}
                    <tr className="bg-yellow-100 font-semibold text-gray-900">
                      <td className="px-4 py-3">Sector Total</td>
                      <td></td>
                      <td></td>
                      <td className="px-4 py-3">
                        ₹ {sectorData.totalInvestment?.toFixed(2)}
                      </td>
                      <td></td>
                      <td className="px-4 py-3">
                        ₹ {sectorData.totalPresentValue?.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-3 ${
                          sectorData.totalGainLoss >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ₹ {sectorData.totalGainLoss?.toFixed(2)}
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  </>
                ),
              )}
            </tbody>
          </table>
        </div>

        {/* Pie Chart */}
        {Object.keys(sectorSummary).length > 0 && (
          <SectorPieChart sectorSummary={sectorSummary} />
        )}
      </div>
    </div>
  );
}
