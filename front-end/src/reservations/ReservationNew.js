//allows manager to create a new reservation
//react hooks
import React, { useState } from "react";
import { useHistory } from "react-router";

//error boundary
import ErrorAlert from "../layout/ErrorAlert"; 

//create reservation
import { createReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

//create new reservation
function ReservationNew() {
  const history = useHistory();
  
  //fields
  const initial = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 1,
  };

  const [reservation, setReservation] = useState(initial);
  const [showError, setShowError] = useState(null);

  function submitHandler(event) {
    event.preventDefault();
    createReservation(reservation)
      .then((createdReservation) => {
        const res_date =
          createdReservation.reservation_date.match(/\d{4}-\d{2}-\d{2}/)[0];
        history.push(`/dashboard?date=` + res_date);
      })
      .catch(setShowError);
  }

  return (
    <main>
      <ErrorAlert error={showError} />
      <h1>Create a New Reservation</h1>
      <ReservationForm
        reservation={reservation}
        setReservation={setReservation}
        submitHandler={submitHandler}
      />
    </main>
  );
}

export default ReservationNew;
