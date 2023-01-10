//react hooks
import React, { useState } from "react";
import Reservations from "./Reservations";

//utility functions
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
  const mobileNumber = { mobile_number: "" };
  const [phoneNumber, setPhoneNumber] = useState({ ...mobileNumber });
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  function loadSearch(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(phoneNumber, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  const changeHandler = (event) => {
    setPhoneNumber({ ...phoneNumber, [event.target.name]: event.target.value });
  };

  const reservationList = reservations.map((reservation) => (
    <Reservations key={reservation.reservation_id} reservation={reservation} />
  ));

  const showErrors = reservationsError && (
    <ErrorAlert error={reservationsError} />
  );

  return (
    <div>
      {showErrors}
      <h1>Search</h1>
      <form onSubmit={loadSearch}>
        <div>
          <input
            placeholder="Search by Phone number"
            onChange={changeHandler}
            value={phoneNumber.mobile_number}
            required
            name="mobile_number"
          />{" "}
          <div className="btn-group">
            <button type="submit" className="btn btn-info btn-sm">
              Search
            </button>
          </div>
        </div>
        <br />
      </form>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">NAME</th>
            <th scope="col">PHONE</th>
            <th scope="col">DATE</th>
            <th scope="col">TIME</th>
            <th scope="col">PARTY SIZE</th>
            <th scope="col">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length > 0 ? (
            reservationList
          ) : (
            <tr>
              <td>No reservations found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Search;