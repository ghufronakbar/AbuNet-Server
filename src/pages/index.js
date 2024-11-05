import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    if (router.isReady) {
      router.push('/admin/login')
    }
  }, [router])

  return null
}
