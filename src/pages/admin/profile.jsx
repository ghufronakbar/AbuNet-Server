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
  adminId: "Loading...",
  name: "Loading...",
  email: "Loading...",
  createdAt: "2024-08-20T12:12:12.000Z",
  updatedAt: "2024-08-20T12:12:12.000Z",
  password: "",
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const AdminProfilePage = () => {
  const router = useRouter();

  // HANDLING NOTIFICATION
  const [successNotify1, setSuccessNotify1] = useState(null);
  const [errorNotify1, setErrorNotify1] = useState(null);
  const [successNotify2, setSuccessNotify2] = useState(null);
  const [errorNotify2, setErrorNotify2] = useState(null);

  useEffect(() => {
    if (successNotify1) {
      setTimeout(() => {
        setSuccessNotify1(null);
      }, 3000);
    }
    if (errorNotify1) {
      setTimeout(() => {
        setErrorNotify1(null);
      }, 3000);
    }
  }, [successNotify1, errorNotify1]);

  useEffect(() => {
    if (successNotify2) {
      setTimeout(() => {
        setSuccessNotify2(null);
      }, 3000);
    }
    if (errorNotify2) {
      setTimeout(() => {
        setErrorNotify2(null);
      }, 3000);
    }
  }, [successNotify2, errorNotify2]);

  // HANDLING PROFILE
  const [isEditedName, setIsEditedName] = useState(false);
  const handleEditProfile = async () => {
    try {
      const res = await axiosInstance.put(`/account/profile`, {
        name: data.name,
        password: data.password,
      });
      data.isAttached = !data.isAttached;
      setSuccessNotify1(res.data.message);
    } catch (error) {
      setErrorNotify1(
        error?.response?.data?.message || "Gagal mengedit profile"
      );
    } finally {
      fetchData();
      setData({
        ...data,
        password: null,
        oldPassword: null,
        newPassword: null,
        confirmPassword: null,
      });
      setIsEditedName(false);
    }
  };

  const handleChangePassword = async () => {
    if (data.newPassword !== data.confirmPassword) {
      setErrorNotify2("Konfirmasi password tidak sesuai");
      return;
    }
    try {
      const res = await axiosInstance.patch(`/account/profile`, {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      setSuccessNotify2(res.data.message);
    } catch (error) {
      setErrorNotify2(
        error?.response?.data?.message || "Gagal mengedit password"
      );
    } finally {
      fetchData();
      setData(initData);
    }
  };

  // HANDLING DATA
  const [data, setData] = useState(initData);
  const fetchData = async () => {
    try {
      setData(initData);
      const { data } = await axiosInstance.get(`/account/profile`);
      setData(data.data);
    } catch (error) {
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
      <LayoutAdmin title={"Profile"}>
        <div className="w-full flex flex-col lg:flex-row justify-center gap-4">
          <div className="bg-white w-full lg:w-1/2 xl:w-2/3 rounded-lg overflow-auto shadow p-4">
            <TableContainer component={Paper} className="mt-4">
              <Table aria-label="simple table">
                <TableBody>
                  <TableRow>
                    <TableCell className="font-bold">ID Admin</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        disabled
                        value={data?.adminId}
                        className="w-full"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-bold">Nama</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={data?.name}
                        onChange={(e) => {
                          setData({ ...data, name: e.target.value });
                          setIsEditedName(true);
                        }}
                        className="w-full"
                      />
                    </TableCell>
                  </TableRow>
                  {isEditedName && (
                    <TableRow>
                      <TableCell className="font-bold">
                        Konfirmasi Password
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={data?.password}
                          onChange={(e) => {
                            setData({ ...data, password: e.target.value });
                          }}
                          className="w-full"
                          type="password"
                        />
                      </TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell className="font-bold">Email</TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        value={data?.email}
                        onChange={(e) => {
                          setData({ ...data, email: e.target.value });
                        }}
                        disabled
                        className="w-full"
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            {successNotify1 && (
              <Alert
                severity="info"
                className="mt-2"
                onClose={() => setSuccessNotify1(null)}
              >
                {successNotify1}
              </Alert>
            )}
            {errorNotify1 && (
              <Alert
                severity="error"
                className="mt-2"
                onClose={() => setErrorNotify1(null)}
              >
                {errorNotify1}
              </Alert>
            )}

            <Button
              variant="contained"
              className="w-fit mt-4"
              onClick={handleEditProfile}
              disabled={!data.password}
            >
              Simpan
            </Button>
          </div>
          <div className="bg-white w-full lg:w-1/2 xl:w-1/3 rounded-lg overflow-auto shadow p-4 pb-8 flex flex-col gap-4">
            <Typography variant="h6" className="text-start font-bold mt-4">
              Ubah Password
            </Typography>
            <div className="flex flex-col gap-2">
              <Typography
                variant="subtitle1"
                className="text-start font-medium mt-2"
              >
                Password Lama
              </Typography>
              <TextField
                size="small"
                value={data?.oldPassword}
                onChange={(e) => {
                  setData({ ...data, oldPassword: e.target.value });
                }}
                type="password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Typography
                variant="subtitle1"
                className="text-start font-medium mt-2"
                type="password"
              >
                Password Baru
              </Typography>
              <TextField
                size="small"
                value={data?.newPassword}
                onChange={(e) => {
                  setData({ ...data, newPassword: e.target.value });
                }}
                type="password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Typography
                variant="subtitle1"
                className="text-start font-medium mt-2"
              >
                Konfirmasi Password
              </Typography>
              <TextField
                size="small"
                value={data?.confirmPassword}
                onChange={(e) => {
                  setData({ ...data, confirmPassword: e.target.value });
                }}
                type="password"
              />
            </div>
            {successNotify2 && (
              <Alert
                severity="info"
                className="mt-2"
                onClose={() => setSuccessNotify1(null)}
              >
                {successNotify2}
              </Alert>
            )}
            {errorNotify2 && (
              <Alert
                severity="error"
                className="mt-2"
                onClose={() => setErrorNotify1(null)}
              >
                {errorNotify2}
              </Alert>
            )}
            {data.oldPassword && (
              <Button
                variant="contained"
                className="w-fit mt-4"
                onClick={handleChangePassword}
                disabled={
                  !data.newPassword ||
                  !data.confirmPassword ||
                  !data.oldPassword
                }
              >
                Simpan
              </Button>
            )}
          </div>
        </div>
      </LayoutAdmin>
    </>
  );
};

export default AuthPage(AdminProfilePage);
