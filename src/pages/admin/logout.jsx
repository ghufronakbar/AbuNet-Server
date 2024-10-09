import { useRouter } from "next/router";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) {
      router.push("/admin/login");
    }
  }, [router.isReady]);

  return null;
};

export default LogoutPage;
