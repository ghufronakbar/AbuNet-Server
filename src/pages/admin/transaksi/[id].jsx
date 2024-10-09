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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const initData = {
  transactionId: "Loading...",
  userId: "Loading...",
  packageId: "Loading...",
  packageName: "Loading...",
  totalPrice: 0,
  itemPrice: 0,
  installationFee: 0,
  overdueFee: 0,
  isPaid: false,
  isCancelled: false,
  snapTokenMT: "Loading...",
  redirectUrlMT: "/admin/transaksi",
  createdAt: "2024-08-20T12:12:12.000Z",
  updatedAt: "2024-08-20T12:12:12.000Z",
  startedAt: null,
  paidAt: null,
  status: "UNPAID",
  package: {
    packageId: "Loading...",
    name: "Loading...",
    description: "Loading...",
    price: 0,
    installationCost: 0,
    image: "/images/placeholder.jpg",
    isActive: true,
    isDeleted: false,
    createdAt: "2024-08-20T12:12:12.000Z",
    updatedAt: "2024-08-20T12:12:12.000Z",
  },
  user: {
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
  },
};

const DetailTransactionPage = () => {
  const router = useRouter();
  const { id } = router.query;

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

  // HANDLING DATA
  const [data, setData] = useState(initData);

  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get(`/transactions/${id}`);
      console.log(data);
      setData(data.data);
    } catch (error) {
      router.push("/admin/transaksi");
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
      <LayoutAdmin title={"Detail Transaksi"}>
        <div className="w-full flex flex-col lg:flex-row justify-center gap-4">
          <div className="bg-white w-full lg:w-1/2 xl:w-2/3 rounded-lg overflow-auto shadow p-4">
            <Typography variant="h5" className="text-center font-bold">
              Rincian Transaksi
            </Typography>
            <TableContainer component={Paper} className="mt-4">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="font-bold">ID Transaksi</TableCell>
                    <TableCell>{data?.transactionId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Nama Paket</TableCell>
                    <TableCell>{data?.packageName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Status</TableCell>
                    <TableCell>
                      {data?.status === "CANCELLED" ? (
                        <span className="text-gray-500">
                          Transaksi Dibatalkan
                        </span>
                      ) : data?.status === "UNPAID" ? (
                        <span className="text-yellow-500">Belum Dibayar</span>
                      ) : data?.status === "PAID" ? (
                        <span className="text-green-500">Sudah Dibayar</span>
                      ) : (
                        <span className="text-red-500">Kadaluarsa</span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Dibuat Pada</TableCell>
                    <TableCell>{formatDate(data?.createdAt)}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            <Typography variant="h6" className="text-start font-bold mt-4">
              Rincian Layanan
            </Typography>
            <TableContainer component={Paper} className="mt-4">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="font-bold">ID Paket</TableCell>
                    <TableCell>{data?.packageId}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Nama Paket</TableCell>
                    <TableCell>{data?.packageName}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">
                      Status Paket Saat Ini
                    </TableCell>
                    <TableCell>
                      {data?.package?.isDeleted ? (
                        <span className="text-red-500">Telah Dihapus</span>
                      ) : data?.package?.isActive ? (
                        <span className="text-green-500">Aktif</span>
                      ) : (
                        <span className="text-gray-500">Tidak Aktif</span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Dibuat Pada</TableCell>
                    <TableCell>{formatDate(data?.createdAt)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Terakhir Diubah</TableCell>
                    <TableCell>{formatDate(data?.updatedAt)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Layanan Dimulai</TableCell>
                    <TableCell>
                      {data?.startedAt ? formatDate(data?.startedAt) : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">
                      Layanan Berakhir
                    </TableCell>
                    <TableCell>
                      {data?.startedAt
                        ? formatDate(oneMonthAhead(new Date(data?.startedAt)))
                        : "-"}
                    </TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
            <Typography variant="h6" className="text-start font-bold mt-4">
              Rincian Biaya
            </Typography>
            <TableContainer component={Paper} className="mt-4">
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell className="font-bold">
                      Total Pembayaran
                    </TableCell>
                    <TableCell>{formatRupiah(data?.totalPrice)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Biaya Paket</TableCell>
                    <TableCell>{formatRupiah(data?.package?.price)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">
                      Biaya Pemasangan
                    </TableCell>
                    <TableCell>{formatRupiah(data?.installationFee)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">
                      Biaya Keterlambatan
                    </TableCell>
                    <TableCell>{formatRupiah(data?.overdueFee)}</TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </TableContainer>
          </div>
          <div className="bg-white w-full lg:w-1/2 xl:w-1/3 rounded-lg overflow-auto shadow p-4 flex flex-col">
            <Image
              src={data?.user?.picture || initData.user.picture}
              alt={data?.user?.name}
              width={200}
              height={200}
              className="w-32 aspect-square object-cover rounded-full self-center"
            />
            <Typography variant="body1" className="text-center mt-4 font-bold">
              {data?.user?.name}
            </Typography>
            <Typography variant="body2" className="text-center mt-1">
              {data?.user?.email}
            </Typography>
            <TableContainer component={Paper} className="mt-4">
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold">Nomor HP</TableCell>
                    <TableCell>
                      {formatPhone(data?.user?.phone) || "Belum Diisi"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Alamat</TableCell>
                    <TableCell>
                      {data?.user?.address || "Belum Diisi"}
                    </TableCell>
                  </TableRow>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell className="font-bold">
                      Status Terpasang
                    </TableCell>
                    <TableCell>
                      {data?.user?.isAttached ? "Sudah" : "Belum"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Link href={`/admin/pengguna/${data?.user?.userId}`}>
              <Button variant="contained" className="w-full mt-4">
                Lihat Detail Pengguna
              </Button>
            </Link>
          </div>
        </div>
      </LayoutAdmin>
    </>
  );
};

export default AuthPage(DetailTransactionPage);
