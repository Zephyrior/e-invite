import { Container, Table } from "react-bootstrap";
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

  if (!user) return <p className="text-center header fs-1">Loading...</p>;
  if (user.role !== "admin") return <p className="text-center header fs-1">Access denied. :c</p>;

  const grouped = guests.reduce(
    (acc, guest) => {
      let key;
      if (guest.is_coming === "Yes") key = "Coming";
      else if (guest.is_coming === "No") key = "Not Coming";
      else key = "Maybe";

      if (!acc[key]) acc[key] = [];
      acc[key].push(guest);
      return acc;
    },
    { Coming: [], "Not Coming": [], Maybe: [] }
  );

  const renderTable = (list, status) => {
    const sumVisitors = status === "Coming" ? list.reduce((sum, g) => sum + (g.num_visitors || 0), 0) : null;
    const totalPeople = list.length;

    return (
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Name</th>
            {status === "Coming" && <th># Visitors</th>}
            {(status === "Not Coming" || status === "Maybe") && <th>Notes</th>}
          </tr>
        </thead>
        <tbody>
          {list.map((g) => (
            <tr key={g.id}>
              <td>{g.full_name}</td>
              {status === "Coming" ? <td>{g.num_visitors}</td> : <td>{g.notes || "-"}</td>}
            </tr>
          ))}

          <tr>
            <td>
              <strong>Total</strong>
            </td>
            {status === "Coming" ? (
              <td>
                <strong>{sumVisitors}</strong>
              </td>
            ) : (
              <td>
                <strong>{totalPeople}</strong>
              </td>
            )}
          </tr>
        </tbody>
      </Table>
    );
  };

  return (
    <Container className="header my-4">
      <h1>Admin Dashboard</h1>
      {Object.entries(grouped).map(([status, list]) => (
        <div key={status} className="my-4">
          <h2>{status}</h2>
          {renderTable(list, status)}
        </div>
      ))}
    </Container>
  );
};

export default Admin;
