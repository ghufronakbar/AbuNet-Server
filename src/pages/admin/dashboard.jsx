import LayoutAdmin from "@/components/LayoutAdmin";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/utils/AuthPage";
import formatRupiah from "@/utils/formatRupiah";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrasi ChartJS komponen yang digunakan
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const monthsInIndonesian = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const initData = {
  count: {
    allTransaction: 0,
    transactionSuccess: 0,
    weeklyTransactionsSuccess: 0,
    transactionFail: 0,
    weeklyTransactionsFail: 0,
    totalUser: 0,
    weeklyUser: 0,
    totalPackages: 0,
  },
  income: {
    totalIncome: 0,
    weeklyIncome: 0,
  },
  allTransaction: [],
  transactionSuccess: [],
  weeklyTransactionsSuccess: [],
  weeklyTransactionsFail: [],
  monthlyRecords: [],
};

// Komponen Chart untuk visualisasi
const LineChart = ({ records }) => {
  const chartData = {
    labels: records.map((record) => monthsInIndonesian[record.month]), // Label bulan dalam bahasa Indonesia
    datasets: [
      {
        label: "Total Pemasukan (Rp)",
        data: records.map((record) => record.totalIncome),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: false, // Tidak diisi area
        tension: 0.4,
        yAxisID: "yIncome", // Dikaitkan dengan sumbu Y untuk income
      },
      {
        label: "Total Transaksi",
        data: records.map((record) => record.totalTransaction),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false, // Tidak diisi area
        tension: 0.4,
        yAxisID: "yTransaction", // Dikaitkan dengan sumbu Y untuk transaction
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Untuk mengontrol tinggi secara custom
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Perkembangan Transaksi dan Pemasukan",
      },
    },
    scales: {
      yIncome: {
        type: "linear",
        display: true,
        position: "left",
        ticks: {
          callback: function (value) {
            return "Rp" + value; // Format untuk pemasukan
          },
        },
      },
      yTransaction: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false, // Tidak menggambar grid untuk sumbu transaksi
        },
        ticks: {
          callback: function (value) {
            return value + " transaksi"; // Format untuk total transaksi
          },
        },
      },
    },
  };

  return (
    <div className="h-96">
      {" "}
      {/* Mengatur tinggi chart */}
      <Line data={chartData} options={options} />
    </div>
  );
};

// Komponen untuk item grid
const GridItem = ({ title, value, percentageText, description, colSpan }) => (
  <div className={`bg-white rounded-lg p-4 shadow h-auto w-full overflow-auto ${colSpan}`}>
    <Typography variant="h6" className="text-md md:text-lg">{title}</Typography>
    <Typography variant="h3">
      {value}
      <span className={`text-sm ${percentageText.color}`}>
        {" "}
        {percentageText.text}
      </span>
    </Typography>
    <Typography variant="body2">{description}</Typography>
  </div>
);

const DashboardPage = () => {
  const [data, setData] = useState(initData);

  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get("/overview");
      setData(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Operasi matematika disimpan dalam variabel konstanta
  const totalIncome = data.income.totalIncome;
  const weeklyIncome = data.income.weeklyIncome;
  const incomePercentage = ((weeklyIncome / totalIncome) * 100).toFixed(2);

  const allTransactions = data.count.allTransaction;
  const weeklyTransactionsTotal =
    data.count.weeklyTransactionsFail + data.count.weeklyTransactionsSuccess;
  const transactionsPercentage = (
    (weeklyTransactionsTotal / allTransactions) *
    100
  ).toFixed(2);

  const transactionSuccessPercentage = (
    (data.count.weeklyTransactionsSuccess / allTransactions) *
    100
  ).toFixed(2);

  const totalUsers = data.count.totalUser;
  const weeklyUserPercentage = (
    (data.count.weeklyUser / totalUsers) *
    100
  ).toFixed(2);

  const incomePerUser = (totalIncome / totalUsers).toFixed(2);
  const weeklyIncomePerUser = (weeklyIncome / totalUsers).toFixed(2);
  const incomePerUserPercentage = (
    (weeklyIncome / totalUsers / (totalIncome / totalUsers)) *
    100
  ).toFixed(2);

  return (
    <LayoutAdmin title={"Dashboard"}>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Line Chart */}
        <div className="col-span-1 md:col-span-4 bg-white rounded-lg p-4 shadow h-auto w-full">
          <LineChart records={data.monthlyRecords} />
        </div>
        {/* Pemasukan Kotor */}
        <GridItem
          title="Pemasukan Kotor"
          value={formatRupiah(totalIncome)}
          percentageText={{
            color:
              incomePercentage > 0
                ? "text-teal-500"
                : incomePercentage == 0
                ? "text-gray-500"
                : "text-red-500",
            text: `+${incomePercentage}%`,
          }}
          description={`+${formatRupiah(weeklyIncome)} Pemasukan minggu ini`}
          colSpan="col-span-1 md:col-span-2"
        />

        {/* Total Transaksi */}
        <GridItem
          title="Total Transaksi"
          value={allTransactions}
          percentageText={{
            color:
              transactionsPercentage > 0
                ? "text-teal-500"
                : transactionsPercentage == 0
                ? "text-gray-500"
                : "text-red-500",
            text: `+${transactionsPercentage}%`,
          }}
          description={`+${weeklyTransactionsTotal} Total transaksi minggu ini`}
          colSpan="col-span-1"
        />

        {/* Transaksi Sukses */}
        <GridItem
          title="Transaksi Sukses"
          value={data.count.transactionSuccess}
          percentageText={{
            color:
              transactionSuccessPercentage > 0
                ? "text-teal-500"
                : transactionSuccessPercentage == 0
                ? "text-gray-500"
                : "text-red-500",
            text: `+${transactionSuccessPercentage}%`,
          }}
          description={`+${data.count.weeklyTransactionsSuccess} Total transaksi sukses minggu ini`}
          colSpan="col-span-1"
        />

        {/* Pengguna Terdaftar */}
        <GridItem
          title="Pengguna Terdaftar"
          value={totalUsers}
          percentageText={{
            color:
              weeklyUserPercentage > 0
                ? "text-teal-500"
                : weeklyUserPercentage == 0
                ? "text-gray-500"
                : "text-red-500",
            text: `+${weeklyUserPercentage}%`,
          }}
          description={`+${data.count.weeklyUser} Total akun baru minggu ini`}
          colSpan="col-span-1"
        />

        {/* Transaksi Gagal Mingguan */}
        <GridItem
          title="Transaksi Gagal Mingguan"
          value={data.count.weeklyTransactionsFail}
          percentageText={{ color: "", text: "" }}
          description={`+${data.count.weeklyTransactionsFail} Total transaksi gagal minggu ini`}
          colSpan="col-span-1"
        />

        {/* Pemasukan per Pengguna */}
        <GridItem
          title="Pemasukan/Pengguna"
          value={formatRupiah(incomePerUser)}
          percentageText={{
            color:
              incomePerUserPercentage > 0
                ? "text-teal-500"
                : incomePerUserPercentage == 0
                ? "text-gray-500"
                : "text-red-500",
            text: `+${incomePerUserPercentage}%`,
          }}
          description={`+${formatRupiah(
            weeklyIncomePerUser
          )} Pemasukan per pengguna minggu ini`}
          colSpan="col-span-1 md:col-span-2"
        />
      </div>
    </LayoutAdmin>
  );
};

export default AuthPage(DashboardPage);
