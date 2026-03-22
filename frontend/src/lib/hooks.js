import { useState, useEffect } from "react";
import { getProfile } from "../services/api";

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getProfile()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return user;
};
