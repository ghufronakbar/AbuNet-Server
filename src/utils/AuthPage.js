import React, { useEffect, useState } from "react";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import axiosInstance from "@/config/axiosInstance";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constant/keyStore";
import { CircularProgress } from "@mui/material";

const AuthPage = (WrappedComponent) => {
    return function WithAuthComponent(props) {
        const [loading, setLoading] = useState(true);
        const router = useRouter();

        useEffect(() => {
            if (router.isReady) {
                const fetchData = async () => {
                    const path = router.asPath
                    const accessToken = Cookie.get(ACCESS_TOKEN);
                    if (!accessToken) {
                        router.push(`/admin/login?redirect=${path}`);
                        return;
                    }
                    try {
                        axiosInstance.defaults.headers.common[
                            "Authorization"
                        ] = `Bearer ${accessToken}`;

                        await axiosInstance.get("/account/auth");

                        setLoading(false);
                    } catch (error) {
                        if (error.response?.status === 401) {
                            const refreshToken = Cookie.get(REFRESH_TOKEN);
                            try {
                                const response = await axiosInstance.post("/account/refresh", {
                                    refreshToken,
                                });

                                const newAccessToken = response.data.accessToken;
                                Cookie.set(ACCESS_TOKEN, newAccessToken);
                                axiosInstance.defaults.headers.common[
                                    "Authorization"
                                ] = `Bearer ${newAccessToken}`;

                                await axiosInstance.get("/account/auth");
                                setLoading(false);
                            } catch (refreshError) {
                                router.push(`/admin/login?redirect=${path}`);
                            }
                        } else {
                            router.push(`/admin/login?redirect=${path}`);
                        }
                    }
                };

                fetchData();
            }
        }, [router]);

        if (loading) {
            return <div className="flex h-screen w-screens items-center justify-center">
                <CircularProgress />
            </div>;
        }

        return <WrappedComponent {...props} />;
    };
};

export default AuthPage;
