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
  { label: "Lokasi", minWidth: 200 },
  { label: "Dibuat Pada", minWidth: 100 },
  {
    label: "Aksi",
    minWidth: 170,
    align: "right",
  },
];

const CoveragePage = () => {
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
      const { data } = await axiosInstance.get("/coverages");
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

  // HANDLING MODAL FORM ADD / EDIT
  const [form, setForm] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = async () => {
    try {
      await axiosInstance.put(`/coverages/${selectedId}`, { location: form });
      setData(
        data.map((item) =>
          item.coverageId === selectedId ? { ...item, location: form } : item
        )
      );
      setSuccessNotify("Berhasil mengedit data");
    } catch (error) {
      console.error(error);
      setErrorNotify(error?.response?.data?.message || "Gagal mengedit data");
    } finally {
      setIsOpen(false);
      setForm("");
      setSelectedId("");
    }
  };

  const handleAdd = async () => {
    try {
      await axiosInstance.post("/coverages", { location: form });
      setData([{ coverageId: Date.now(), location: form }, ...data]);
      setSuccessNotify("Berhasil menambahkan data");
    } catch (error) {
      console.error(error);
      setErrorNotify(
        error?.response?.data?.message || "Gagal menambahkan data"
      );
    } finally {
      setIsOpen(false);
      setForm("");
      setSelectedId("");
      fetchData();
    }
  };

  //   HANDLING DELETE
  const [confirmDelete, setConfirmDelete] = useState(null);
  const open = Boolean(confirmDelete);
  const id = open ? "simple-popover" : undefined;

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/coverages/${selectedId}`);
      setData(data.filter((item) => item.coverageId !== selectedId));
      setSuccessNotify("Berhasil menghapus data");
    } catch (error) {
      console.error(error);
      setErrorNotify(error?.response?.data?.message || "Gagal menghapus data");
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
          <Typography>Apakah anda yakin ingin menghapus data ini?</Typography>
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
      <Modal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setForm("");
          setSelectedId("");
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            borderRadius: 2,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {selectedId ? "Edit Lokasi" : "Tambah Lokasi"}
          </Typography>
          <TextField
            id="outlined-basic"
            label="Lokasi"
            variant="outlined"
            className="w-full"
            value={form}
            onChange={(e) => setForm(e.target.value)}
          />
          <Button
            color="primary"
            variant="contained"
            className="mx-auto"
            onClick={selectedId ? handleEdit : handleAdd}
            disabled={!form}
          >
            Simpan
          </Button>
        </Box>
      </Modal>
      <LayoutAdmin title={"Daftar Cakupan Wilayah"}>
        <div className="flex flex-row justify-between items-center mb-4">
          <TextField
            label="Cari..."
            variant="outlined"
            value={search}
            onChange={handleSearch}
            color="white"
            type="search"            
          />
          <Button
            variant="contained"
            onClick={() => setIsOpen(true)}
            startIcon={<AddCircleOutline />}
          >
            Tambah
          </Button>
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
                  .filter((item) =>
                    item.location.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((item, index) => (
                    <TableRow hover key={"row-" + index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.location}</TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell align="right" className="flex gap-2">
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => {
                            setIsOpen(true);
                            setForm(item.location);
                            setSelectedId(item.coverageId);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          color="error"
                          variant="contained"
                          onClick={(event) => {
                            setConfirmDelete(event.currentTarget);
                            setSelectedId(item.coverageId);
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
          {data.filter((item) =>
            item.location.toLowerCase().includes(search.toLowerCase())
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

export default AuthPage(CoveragePage);
