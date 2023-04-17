import React, { createContext, useContext, useEffect, useState } from "react";
import useLocalStorage from "../utils";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [user, setUser] = useLocalStorage("userInfo", "");
  const [refresh, setRefresh] = useState(false);
  const fetchHomepageData = () => {
    const user = localStorage.getItem("userInfo");
    const { token } = JSON.parse(user);

    const options = {
      method: "GET",
      url: "http://localhost:1337/",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(options)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <AuthContext.Provider
      value={{
        setUser,
        user,
        loading,
        setLoading,
        fetchHomepageData,
        data,
        setData,
        refresh,
        setRefresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const dataState = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
