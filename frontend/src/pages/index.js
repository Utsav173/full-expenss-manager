import { useEffect, useState } from "react";
import Homepage from "./homepage";
import Login from "./login";
import { dataState } from "../../context";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userInfo"));
    if (userData) {
      router.push("/homepage");
    } else {
      router.push("/login");
    }
  }, []);

  const { user } = dataState();
  if (user) {
    return <Homepage />;
  } else {
    return <Login />;
  }
}
