//react hooks
import React, { useEffect, useState } from "react";
import {useHistory} from "react-router-dom";

//utility functions
import { listReservations, listTables } from "../utils/api";
import useQuery from "../utils/useQuery";
import { next, previous } from "../utils/date-time";

//components
import ErrorAlert from "../layout/ErrorAlert";
import Reservations from "./Reservations";
import Tables from "./Tables";

function Dashboard({ date }) {
  //variables for query/date
  const query = useQuery();
  const dateQuery = query.get("date");
   console.log("line 19", dateQuery);
  //current date in YYYY-MM-DD format
  const today = new Date().toJSON().slice(0, 10);

  //access history
  const history = useHistory();

  //state and errors for reservations
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  //state and errors for tables
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  //state for date/query
  const [dashDate, setDashDate] = useState(dateQuery ? dateQuery : today);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    //get reservation data
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    //get tables data
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    //stop fetch when window is closed
    return () => abortController.abort();
  }
console.log("line 51", reservations)
  //change date/query to previous day
  const handlePrevious = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${previous(dashDate)}`);
    setDashDate(previous(dashDate));
  };

  //change date/query to next day
  const handleNext = (event) => {
    event.preventDefault();
    history.push(`/dashboard?date=${next(dashDate)}`);
    setDashDate(next(dashDate));
  };

  //change date/query to today
  const handleToday = (event) => {
    event.preventDefault();
    setDashDate(today);
    history.push(`/dashboard?date=${today}`);
  };

  //list all tables
  const tableList = tables.map((table) => (
    <Tables loadDashboard={loadDashboard} key={table.table_id} table={table} />
  ));

  //list all reservations
  const reservationList = reservations.map((reservation) => (
    <Reservations
      loadDashboard={loadDashboard}
      key={reservation.reservation_id}
      reservation={reservation}
    />
  ));
console.log("line 86", reservationList)
  //header, buttons, and two tables - reservations and tables
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Phone</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">People</th>
            <th scope="col">Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{reservationList}</tbody>
      </table>

      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>

      <main>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Table Name</th>
              <th scope="col">Capacity</th>
              <th scope="col">Is Occupied?</th>
              <th scope="col">Meal is Finished</th>
            </tr>
          </thead>
          <tbody>{tableList}</tbody>
        </table>
      </main>

      <div className="row">
        <div className="btn-group col" role="group" aria-label="Basic example">
          <button
            type="button"
            className="btn btn-info"
            onClick={handlePrevious}
          >
            <span className="oi oi-chevron-left"></span>
            &nbsp;Previous
          </button>
          <button type="button" className="btn btn-info" onClick={handleToday}>
            Today
          </button>
          <button type="button" className="btn btn-info" onClick={handleNext}>
            Next&nbsp;
            <span className="oi oi-chevron-right"></span>
          </button>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
