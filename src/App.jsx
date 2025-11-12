import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import UserPage from "./components/UserPage";
import Gallery from "./components/Gallery";
import Admin from "./components/Admin";
import Footer from "./components/Footer";
import { supabase } from "./supabaseClient";
function App() {
  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const { data: authUser } = await supabase.auth.getUser(); // fetch auth info
      if (!authUser.user) return;

      const { data, error } = await supabase.from("users").select("*").eq("id", authUser.user.id).single();

      if (error) {
        console.error("Error fetching user row:", error);
        return;
      }

      // Merge Auth info + DB info
      setDbUser({ ...authUser.user, ...data });
    }

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setDbUser(null);
      } else {
        supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data, error }) => {
            if (error) console.error(error);
            else setDbUser({ ...session.user, ...data });
          });
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rsvp" element={<UserPage user={dbUser} />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<Admin user={dbUser} />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}
export default App;
