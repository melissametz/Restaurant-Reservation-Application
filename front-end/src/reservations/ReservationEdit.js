//react hooks
import React, { useState, useEffect } from "react";

//component
import ReservationForm from "./ReservationForm";

//utility functions
import { updateReservation, readReservation } from "../utils/api";
import { useParams, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

//edit reservation form
function ReservationEdit() {
  const history = useHistory();
  const { reservation_id } = useParams();

  //clear form
  const initial = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  //state variables
  const [reservation, setReservation] = useState(initial);
  const [reservationsError, setReservationsError] = useState(null);
  const [error, setError] = useState(null);

  //effect hook
  useEffect(loadDashboard, [reservation_id]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    readReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  async function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await updateReservation(
        //reservation_id,
        reservation,
        abortController.signal
      );
      setReservation(initial);
      const res_date =
        reservation.reservation_date.match(/\d{4}-\d{2}-\d{2}/)[0];
      history.push(`/dashboard?date=` + res_date);
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  }

  return (
    <main>
      <ErrorAlert error={error} />
      <ErrorAlert error={reservationsError} />
      <h1>Edit Reservation</h1>
      <ReservationForm
        reservation={reservation}
        setReservation={setReservation}
        submitHandler={submitHandler}
      />
    </main>
  );
}

export default ReservationEdit;