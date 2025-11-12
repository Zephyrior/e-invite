import { Container } from "react-bootstrap";
import "/src/styles/Header.css";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Admin = ({ user }) => {
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    async function fetchGuests() {
      if (!user || user.role !== "admin") return;

      const { data } = await supabase.from("users").select("id, full_name, email, is_coming, num_visitors, notes");

      setGuests(data);
    }

    fetchGuests();
  }, [user]);

  if (user.role !== "admin") return <p>Access denied</p>;

  const grouped = guests.reduce((acc, guest) => {
    const key = guest.is_coming ? "Attending" : "Not Attending";
    if (!acc[key]) acc[key] = [];
    acc[key].push(guest);
    return acc;
  }, {});

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {Object.entries(grouped).map(([status, list]) => (
        <div key={status}>
          <h2>{status}</h2>
          <ul>
            {list.map((g) => (
              <li key={g.id}>
                {g.full_name} - {g.num_visitors} visitors
                {g.notes && ` (Notes: ${g.notes})`}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Admin;
