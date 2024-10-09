import LayoutAdmin from "@/components/LayoutAdmin";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/utils/AuthPage";
import formatDate from "@/utils/formatDate";
import { AddCircleOutline } from "@mui/icons-material";
import {
  Alert,
  Badge,
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
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsTrash } from "react-icons/bs";

const columns = [
  { label: "No", minWidth: 50 },
  { label: "Nama", minWidth: 200 },
  { label: "Total Transaksi", minWidth: 50 },
  { label: "Status", minWidth: 200, align: "center" },
  { label: "Dibuat Pada", minWidth: 100 },
  {
    label: "Aksi",
    minWidth: 170,
    align: "right",
  },
];

const initForm = {
  name: "",
  description: "",
  installationCost: 0,
  image: "/images/placeholder.jpg",
  price: 0,
  specifications: [
    {
      spec: "",
    },
  ],
};

const PackagePage = () => {
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
      const { data } = await axiosInstance.get("/packages");
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
  const [form, setForm] = useState(initForm);
  const [selectedId, setSelectedId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = async () => {
    try {
      for (const s of form.specifications) {
        delete s.specificationId;
        delete s.packageId;
        delete s.createdAt;
        delete s.updatedAt;
      }
      if (
        form.image !== initForm.image &&
        initForm !== null &&
        typeof form.image !== "string"
      ) {
        const formData = new FormData();
        formData.append("image", form.image);
        const { data } = await axiosInstance.post(
          `/packages/${selectedId}/image`,
          formData
        );
      }
      await axiosInstance.put(`/packages/${selectedId}`, form);
      setSuccessNotify("Berhasil mengedit data");
      fetchData();
    } catch (error) {
      console.error(error);
      setErrorNotify(error?.response?.data?.message || "Gagal mengedit data");
    } finally {
      setIsOpen(false);
      setForm(initForm);
      setSelectedId("");
    }
  };

  const handleAdd = async () => {
    try {
      const formData = new FormData();
      formData.append("image", form.image);
      const { data } = await axiosInstance.post("/packages", form);
      await axiosInstance.post(
        `/packages/${data.data.packageId}/image`,
        formData
      );
      setSuccessNotify("Berhasil menambahkan data");
    } catch (error) {
      console.error(error);
      setErrorNotify(
        error?.response?.data?.message || "Gagal menambahkan data"
      );
    } finally {
      setIsOpen(false);
      setForm(initForm);
      setSelectedId("");
      fetchData();
    }
  };

  //   HANDLING DELETE
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmStatus, setConfirmStatus] = useState(null);
  const open1 = Boolean(confirmDelete);
  const open2 = Boolean(confirmStatus);
  const id = open1 ? "simple-popover" : undefined;

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/packages/${selectedId}`);
      setData(data.filter((item) => item.packageId !== selectedId));
      setSuccessNotify("Berhasil menghapus data");
    } catch (error) {
      console.error(error);
      setErrorNotify(error?.response?.data?.message || "Gagal menghapus data");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleStatus = async (isActive) => {
    try {
      const { data } = await axiosInstance.patch(`/packages/${selectedId}`, {
        isActive,
      });
      await fetchData();
      setSuccessNotify("Berhasil menghapus data");
    } catch (error) {
      console.error(error);
      setErrorNotify(error?.response?.data?.message || "Gagal menghapus data");
    } finally {
      setConfirmStatus(null);
    }
  };

  return (
    <>
      <Popover
        id={id}
        open={open1}
        anchorEl={confirmDelete}
        onClose={() => {
          setConfirmDelete(null);
          setSelectedId("");
        }}
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
      <Popover
        id={id}
        open={open2}
        anchorEl={confirmStatus}
        onClose={() => {
          setConfirmStatus(null);
          setSelectedId("");
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Box className="flex flex-col gap-2 px-4 py-2">
          <Typography>
            Apakah anda yakin ingin{" "}
            {data.find((item) => item.packageId === selectedId)?.isActive
              ? "menonaktifkan"
              : "mengaktifkan"}{" "}
            paket ini?
          </Typography>
          <Button
            color="error"
            variant="contained"
            className="mx-auto"
            onClick={() => {
              handleStatus(
                data.find((item) => item.packageId === selectedId)?.isActive
                  ? false
                  : true
              );
            }}
          >
            Ya
          </Button>
        </Box>
      </Popover>
      <Modal
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setForm(initForm);
          setSelectedId("");
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
            overflow: "auto",
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
            {selectedId ? "Edit Layanan" : "Tambah Layanan"}
          </Typography>
          <Image
            src={
              selectedId && typeof form.image === "string"
                ? form.image
                : !form.image
                ? initForm.image
                : form.image !== initForm.image
                ? URL.createObjectURL(form.image)
                : initForm.image
            }
            alt={form.name}
            width={900}
            height={400}
            className="w-full md:w-1/2 lg:w-1/3 aspect-[16/9] object-cover rounded-md mx-auto"
          />
          <Button
            className="w-fit mx-auto"
            onClick={() => {
              document.getElementById("imagePicker").click();
              console.log(form.image);
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              id="imagePicker"
              className="hidden"
            />
            {form.image === initForm.image ? "Unggah" : "Ubah"} Gambar
          </Button>
          <TextField
            label="Nama Layanan"
            variant="outlined"
            className="w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Deskripsi Layanan"
            variant="outlined"
            className="w-full"
            value={form.description}
            multiline
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            label="Biaya Layanan"
            variant="outlined"
            className="w-full"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <TextField
            label="Biaya Installasi"
            variant="outlined"
            className="w-full"
            type="number"
            value={form.installationCost}
            onChange={(e) =>
              setForm({ ...form, installationCost: e.target.value })
            }
          />
          {form.specifications.map((spec, index) => (
            <div
              key={"specDiv" + index}
              className="w-full flex flex-col gap-2 items-center"
            >
              <TextField
                label={`Spesifikasi ${index + 1}`}
                variant="outlined"
                className="w-full"
                value={spec.spec}
                onChange={(e) =>
                  setForm({
                    ...form,
                    specifications: form.specifications.map((s, i) =>
                      i === index ? { spec: e.target.value } : s
                    ),
                  })
                }
              />
              <Button
                color="error"
                variant="contained"
                className="w-fit self-end flex justify-center items-center"
                onClick={() =>
                  setForm({
                    ...form,
                    specifications: form.specifications.filter(
                      (s, i) => i !== index
                    ),
                  })
                }
              >
                <BsTrash />
              </Button>
            </div>
          ))}
          {form.specifications[form.specifications.length - 1].spec !== "" && (
            <Button
              color="primary"
              className="w-fit self-end flex justify-center items-center"
              onClick={() =>
                setForm({
                  ...form,
                  specifications: [...form.specifications, { spec: "" }],
                })
              }
            >
              Tambah Spesifikasi Lainnya
            </Button>
          )}
          <Button
            color="primary"
            variant="contained"
            className="mx-auto"
            onClick={selectedId ? handleEdit : handleAdd}
            disabled={
              form.name === "" ||
              form.description === "" ||
              form.price < 0 ||
              form.installationCost < 0 ||
              (selectedId === "" && !form.image) ||
              form.specifications.length === 0 ||
              form.specifications.some((s) => s.spec === "")
            }
          >
            Simpan
          </Button>
        </Box>
      </Modal>
      <LayoutAdmin title={"Daftar Layanan"}>
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
                    item.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((item, index) => (
                    <TableRow hover key={"row-" + index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item._count.transactions}</TableCell>
                      <TableCell>
                        <div
                          className={`mx-auto px-4 py-1 rounded-full text-white w-fit ${
                            item.isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {item.isActive ? "Aktif" : "Tidak Aktif"}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell align="right" className="flex gap-2">
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={() => {
                            setIsOpen(true);
                            setForm(item);
                            setSelectedId(item.packageId);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          color="error"
                          variant="contained"
                          onClick={(event) => {
                            setConfirmDelete(event.currentTarget);
                            setSelectedId(item.packageId);
                          }}
                        >
                          Hapus
                        </Button>
                        <Button
                          color="secondary"
                          variant="contained"
                          onClick={(event) => {
                            setConfirmStatus(event.currentTarget);
                            setSelectedId(item.packageId);
                          }}
                        >
                          {item.isActive ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          {data.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
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

export default AuthPage(PackagePage);
