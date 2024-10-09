import LayoutAdmin from "@/components/LayoutAdmin";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/utils/AuthPage";
import formatDate from "@/utils/formatDate";
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
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const columns = [
  { label: "No", minWidth: 50 },
  { label: "Transaksi ID", minWidth: 200 },
  { label: "Paket", minWidth: 200 },
  { label: "Status", minWidth: 100 },
  { label: "Dibuat Pada", minWidth: 100 },
  {
    label: "Aksi",
    minWidth: 170,
    align: "right",
  },
];

const TransactionPage = () => {
  const router = useRouter();

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
  const [data, setData] = useState([]);
  const [search, setSearch] = useState(router.query.search || "");
  const fetchData = async () => {
    try {
      const { data } = await axiosInstance.get("/transactions");
      setData(data.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    router.push({
      pathname: router.pathname,
      query: { search: e.target.value },
    });
  };

  return (
    <>
      <LayoutAdmin title={"Riwayat Transaksi"}>
        <div className="flex flex-row justify-between items-center mb-4">
          <TextField
            label="Cari..."
            variant="outlined"
            value={search}
            onChange={handleSearch}
            color="white"
            type="search"
          />
        </div>
        {successNotify && (
          <Alert
            severity="info"
            className="mb-4"
            onClose={() => setSuccessNotify(null)}
          >
            {successNotify}
          </Alert>
        )}
        {errorNotify && (
          <Alert
            severity="error"
            className="mb-4"
            onClose={() => setErrorNotify(null)}
          >
            {errorNotify}
          </Alert>
        )}
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column, idx) => (
                    <TableCell
                      key={"col-" + idx}
                      align={column.align || "left"}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data
                  .filter(
                    (item) =>
                      item.transactionId
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      item.packageName
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      item.status
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                      item.user.name
                        .toLowerCase()
                        .includes(search.toLowerCase())
                  )
                  .map((item, index) => (
                    <TableRow hover key={"row-" + index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Typography className="font-bold">
                          {item.transactionId}
                        </Typography>
                        <Typography>{item.user.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="font-bold">
                          {item.packageName}
                        </Typography>
                        <Typography>{formatRupiah(item.totalPrice)}</Typography>
                      </TableCell>
                      <TableCell>
                        {item?.status === "CANCELLED" ? (
                          <span className="text-gray-500">
                            Transaksi Dibatalkan
                          </span>
                        ) : item?.status === "UNPAID" ? (
                          <span className="text-yellow-500">Belum Dibayar</span>
                        ) : item?.status === "PAID" ? (
                          <span className="text-green-500">Sudah Dibayar</span>
                        ) : (
                          <span className="text-red-500">Kadaluarsa</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell align="right">
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() =>
                            router.push(
                              "/admin/transaksi/" + item.transactionId
                            )
                          }
                        >
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {data.filter(
            (item) =>
              item.transactionId.toLowerCase().includes(search.toLowerCase()) ||
              item.packageName.toLowerCase().includes(search.toLowerCase()) ||
              item.status.toLowerCase().includes(search.toLowerCase()) ||
              item.user.name.toLowerCase().includes(search.toLowerCase())
          ).length === 0 &&
            search !== "" && (
              <Typography
                variant="body2"
                color="GrayText"
                className="w-full text-center my-8"
              >
                Tidak ada data ditemukan dengan kata kunci{" "}
                <span className="font-bold">&quot;{search}&quot;</span>
              </Typography>
            )}
        </Paper>
      </LayoutAdmin>
    </>
  );
};

export default AuthPage(TransactionPage);
