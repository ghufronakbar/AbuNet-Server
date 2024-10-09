import LayoutAdmin from "@/components/LayoutAdmin";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/utils/AuthPage";
import formatDate from "@/utils/formatDate";
import { AddCircleOutline } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Modal,
  Paper,
  Popover,
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
  { label: "Nama", minWidth: 200 },
  { label: "Total Transaksi", minWidth: 50 },
  { label: "Status Pemasangan", minWidth: 200 },
  { label: "Status Langganan", minWidth: 200 },
  { label: "Terdaftar Pada", minWidth: 100 },
  {
    label: "Aksi",
    minWidth: 170,
    align: "right",
  },
];

const UserPage = () => {
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
      const { data } = await axiosInstance.get("/users");
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

  //   HANDLING DELETE
  const [confirmDelete, setConfirmDelete] = useState(null);
  const open = Boolean(confirmDelete);
  const id = open ? "simple-popover" : undefined;

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/userId/${selectedId}`);
      setData(data.filter((item) => item.userId !== selectedId));
      setSuccessNotify("Berhasil menghapus data");
    } catch (error) {
      console.error(error);
      setErrorNotify(error?.response?.item?.message || "Gagal menghapus data");
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={confirmDelete}
        onClose={() => setConfirmDelete(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box className="flex flex-col gap-2 px-4 py-2">
          <Typography>
            Apakah anda yakin ingin menghapus pengguna ini?
          </Typography>
          <Button
            color="error"
            variant="contained"
            className="mx-auto"
            onClick={handleDelete}
          >
            Hapus
          </Button>
        </Box>
      </Popover>
      <LayoutAdmin title={"Daftar Pengguna"}>
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
                      item.name.toLowerCase().includes(search.toLowerCase()) ||
                      item.email.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((item, index) => (
                    <TableRow hover key={"row-" + index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Typography className="font-bold">
                          {item.name}
                        </Typography>
                        <Typography>{item.email}</Typography>
                      </TableCell>
                      <TableCell>{item._count.transactions}</TableCell>
                      <TableCell>
                        {item.isAttached ? "Terpasang" : "Belum Terpasang"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`text-center mx-auto text-${
                            item?.subscriptionStatus === "NOT_SUBSCRIBED"
                              ? "gray-500"
                              : item?.subscriptionStatus === "SUBSCRIBED"
                              ? "green-500"
                              : item?.subscriptionStatus === "NEED_RENEWAL"
                              ? "yellow-500"
                              : item?.subscriptionStatus === "OVERDUE"
                              ? "red-500"
                              : ""
                          }`}
                        >
                          {item?.subscriptionStatus === "NOT_SUBSCRIBED"
                            ? "Tidak Berlangganan"
                            : item?.subscriptionStatus === "SUBSCRIBED"
                            ? "Berlangganan"
                            : item?.subscriptionStatus === "NEED_RENEWAL"
                            ? "Butuh Perpanjangan"
                            : item?.subscriptionStatus === "OVERDUE"
                            ? "Terlambat Pembayaran"
                            : ""}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell align="right" className="flex gap-2">
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() =>
                            router.push(`/admin/pengguna/${item.userId}`)
                          }
                        >
                          Detail
                        </Button>
                        <Button
                          color="error"
                          variant="contained"
                          onClick={(event) => {
                            setConfirmDelete(event.currentTarget);
                            setSelectedId(item.userId);
                          }}
                        >
                          Hapus
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {data.filter(
            (item) =>
              item.name.toLowerCase().includes(search.toLowerCase()) ||
              item.email.toLowerCase().includes(search.toLowerCase())
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

export default AuthPage(UserPage);
