import LayoutAdmin from "@/components/LayoutAdmin";
import axiosInstance from "@/config/axiosInstance";
import oneMonthAhead from "@/helper/oneMonthAhead";
import AuthPage from "@/utils/AuthPage";
import formatDate from "@/utils/formatDate";
import formatPhone from "@/utils/formatPhone";
import formatRupiah from "@/utils/formatRupiah";
import {
  Alert,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { TbExternalLink } from "react-icons/tb";

const initData = {
  userId: "Loading...",
  name: "Loading...",
  email: "Loading...",
  address: "Loading...",
  picture: "/images/profile.png",
  phone: "Loading...",
  isAttached: false,
  isDeleted: false,
  createdAt: "2024-08-20T12:12:12.000Z",
  updatedAt: "2024-08-20T12:12:12.000Z",
  _count: {
    transactions: 0,
  },
  subscriptionStatus: "NOT_SUBSCRIBED",
  transactions: [],
};

const DetailUserPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const sp = useSearchParams();

  // HANDLING NOTIFICATION
  const [successNotify, setSuccessNotify] = useState(null);
  const [errorNotify, setErrorNotify] = useState(null);

  useEffect(() => {
    if (successNotify) {
      setTimeout(() => {
        setSuccessNotify(null);
      }, 3000);
    }
    if (errorNotify) {
      setTimeout(() => {
        setErrorNotify(null);
      }, 3000);
    }
  }, [successNotify, errorNotify]);

  // HANDLING ATTACHED
  const handleAttached = async () => {
    try {
      const res = await axiosInstance.patch(`/users/${id}`);
      data.isAttached = !data.isAttached;
      setSuccessNotify(res.data.message);
    } catch (error) {
      setErrorNotify(error?.response?.data?.message || "Gagal mengedit data");
    } finally {
      fetchData();
    }
  };

  // HANDLING DATA
  const [data, setData] = useState(initData);
  const latestPaidTransaction = data?.transactions.find(
    (transaction) => transaction.status === "PAID"
  );
  const [search, setSearch] = useState(sp.get("search") || "");
  const handleSearch = (e) => {
    setSearch(e.target.value);
    router.push(`/admin/pengguna/${id}?search=${e.target.value}`);
  };

  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get(`/users/${id}`);
      console.log(data);
      setData(data.data);
    } catch (error) {
      router.push("/admin/pengguna");
      console.error(error);
    }
  };
  useEffect(() => {
    if (router.isReady) {
      fetchData();
    }
  }, [router.isReady]);

  return (
    <>
      <LayoutAdmin title={"Detail Pengguna"}>
        <div className="w-full flex flex-col lg:flex-row justify-center gap-4">
          <div className="bg-white w-full lg:w-1/2 xl:w-2/3 rounded-lg overflow-auto shadow p-4">
            <div className="flex flex-col md:flex-row justify-center items-center mx-auto gap-4 my-4">
              <Image
                src={data?.picture || initData.picture}
                alt={data?.name}
                width={200}
                height={200}
                className="w-32 aspect-square object-cover rounded-full"
              />
              <div className="flex flex-col text-center md:text-start">
                <Typography variant="body1" className="font-bold md:text-2xl">
                  {data?.name}
                </Typography>
                <Typography variant="body2" className="font-normal">
                  {data?.email}
                </Typography>
              </div>
            </div>
            <TableContainer component={Paper} className="mt-4">
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold">ID Pengguna</TableCell>
                    <TableCell>{data?.userId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Nomor HP</TableCell>
                    <TableCell>
                      {formatPhone(data?.phone) || "Belum Diisi"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Alamat</TableCell>
                    <TableCell>{data?.address || "Belum Diisi"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">
                      Total Transasksi
                    </TableCell>
                    <TableCell>{data?._count?.transactions}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Paket Langganan</TableCell>
                    <TableCell>
                      {data?.transactions[0]?.packageName || "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">
                      Waktu Mulai Paket Terakhir
                    </TableCell>
                    <TableCell>
                      {data?.transactions.length > 0
                        ? formatDate(latestPaidTransaction?.createdAt)
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">
                      Tenggat Pembayaran Terakhir
                    </TableCell>
                    <TableCell>
                      {data?.transactions.length > 0
                        ? formatDate(
                            oneMonthAhead(
                              new Date(latestPaidTransaction?.createdAt)
                            )
                          )
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">
                      Status Berlangganan
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-${
                          data?.subscriptionStatus === "NOT_SUBSCRIBED"
                            ? "gray-500"
                            : data?.subscriptionStatus === "SUBSCRIBED"
                            ? "green-500"
                            : data?.subscriptionStatus === "NEED_RENEWAL"
                            ? "yellow-500"
                            : data?.subscriptionStatus === "OVERDUE"
                            ? "red-500"
                            : ""
                        }`}
                      >
                        {data?.subscriptionStatus === "NOT_SUBSCRIBED"
                          ? "Tidak Berlangganan"
                          : data?.subscriptionStatus === "SUBSCRIBED"
                          ? "Berlangganan"
                          : data?.subscriptionStatus === "NEED_RENEWAL"
                          ? "Butuh Perpanjangan"
                          : data?.subscriptionStatus === "OVERDUE"
                          ? "Terlambat Pembayaran"
                          : ""}
                      </span>
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell className="font-bold">
                      Status Terpasang
                    </TableCell>
                    <TableCell>
                      {data?.isAttached ? "Sudah" : "Belum"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {successNotify && (
              <Alert
                severity="info"
                className="mt-2"
                onClose={() => setSuccessNotify(null)}
              >
                {successNotify}
              </Alert>
            )}
            {errorNotify && (
              <Alert
                severity="error"
                className="mt-2"
                onClose={() => setErrorNotify(null)}
              >
                {errorNotify}
              </Alert>
            )}
            <Button
              variant="contained"
              className="w-fit mt-4"
              color={data?.isAttached ? "error" : "success"}
              onClick={handleAttached}
            >
              Tandai {data?.isAttached ? "Tidak Terpasang" : "Terpasang"}
            </Button>
          </div>
          <div className="bg-white w-full lg:w-1/2 xl:w-1/3 rounded-lg overflow-auto shadow p-4 flex flex-col">
            <Typography variant="h6" className="text-start font-bold mt-4">
              Riwayat Transaksi
            </Typography>
            <TextField
              label="Cari..."
              variant="outlined"
              value={search}
              onChange={handleSearch}
              color="white"
              type="search"
            />
            <TableContainer component={Paper} className="mt-4">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Nama Paket</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Tanggal Transaksi</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.transactions
                    .filter(
                      (t) =>
                        t.transactionId
                          .toLowerCase()
                          .includes(search.toLowerCase()) ||
                        t.packageName
                          .toLowerCase()
                          .includes(search.toLowerCase())
                    )
                    .map((transaction, index) => (
                      <TableRow key={transaction.transactionId}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{transaction.packageName}</TableCell>
                        <TableCell>
                          {formatRupiah(transaction.totalPrice)}
                        </TableCell>
                        <TableCell>
                          {transaction?.status === "CANCELLED" ? (
                            <span className="text-gray-500">
                              Transaksi Dibatalkan
                            </span>
                          ) : transaction?.status === "UNPAID" ? (
                            <span className="text-yellow-500">
                              Belum Dibayar
                            </span>
                          ) : transaction?.status === "PAID" ? (
                            <span className="text-green-500">
                              Sudah Dibayar
                            </span>
                          ) : (
                            <span className="text-red-500">Kadaluarsa</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatDate(transaction.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/admin/transaksi/${transaction.transactionId}`}
                          >
                            <TbExternalLink />
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            {data.transactions.length === 0 && search === "" ? (
              <Typography
                variant="body2"
                color="GrayText"
                className="w-full text-center my-8"
              >
                Tidak ada riwayat transaksi
              </Typography>
            ) : (
              data.transactions
                .filter(
                  (t) =>
                    t.transactionId
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    t.packageName.toLowerCase().includes(search.toLowerCase())
                )
                .map(
                  (item) =>
                    item.transactionId
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    item.packageName
                      .toLowerCase()
                      .includes(search.toLowerCase())
                ).length === 0 &&
              search !== "" && (
                <Typography
                  variant="body2"
                  color="GrayText"
                  className="w-full text-center my-8"
                >
                  Tidak ada riwayat transaksi dengan kata kunci{" "}
                  <span className="font-bold">&quot;{search}&quot;</span>
                </Typography>
              )
            )}
          </div>
        </div>
      </LayoutAdmin>
    </>
  );
};

export default AuthPage(DetailUserPage);
