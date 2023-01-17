import React, { useEffect } from "react";
import { useNavigate} from "react-router-dom";

export default function Logout({ setIsAuthenticated }) {
  const history = useNavigate();

  useEffect(() => {
    fetch("http://localhost:7070/api/users/logout", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        setIsAuthenticated(false);
        history("sucess");
      }
    });
  }, [history, setIsAuthenticated]);

  return <></>;
}
