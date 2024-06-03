import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../db/supabaseClient";

const ProtectedRouteAdmin = ({ children }) => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      handleUser();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleUser = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (error) {
        throw error;
      }
      setRole(data.role);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  if (!user || role !== "admin") {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRouteAdmin;
