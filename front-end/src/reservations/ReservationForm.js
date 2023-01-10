//react hooks
import React from "react";
import { useHistory } from "react-router-dom";
//import { createReservation } from "../utils/api";

//reservation form - submits or cancels reservation
function ReservationForm({ reservation, setReservation, submitHandler }) {
  const history = useHistory();

  function changeHandler({ target: { name, value } }) {
    setReservation((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  //number of people
  function changeHandlerNumber({ target: { name, value } }) {
    setReservation((prevState) => ({
      ...prevState,
      [name]: Number(value),
    }));
  }

  return (
    <form onSubmit={submitHandler}>
      <p>Reservation Form</p>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">First Name</label>
        <div className="col-sm-10">
          <input
            name="first_name"
            value={reservation.first_name}
            onChange={changeHandler}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Last Name</label>
        <div className="col-sm-10">
          <input
            name="last_name"
            value={reservation.last_name}
            onChange={changeHandler}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Mobile Number</label>
        <div className="col-sm-10">
          <input
            name="mobile_number"
            type="tel"
            pattern="[0-9\-]+"
            value={reservation.mobile_number}
            onChange={changeHandler}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Date of reservation</label>
        <div className="col-sm-10">
          <input
            name="reservation_date"
            type="date"
            value={reservation.reservation_date}
            onChange={changeHandler}
          />
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Time of reservation</label>
        <div className="col-sm-10">
          <input
            name="reservation_time"
            type="time"
            value={reservation.reservation_time}
            onChange={changeHandler}
          />
          <small className="col-sm-2">
            Reservation hours are between 10:30 am and 9:30 pm{" "}
          </small>
        </div>
      </div>
      <div className="form-group row">
        <label className="col-sm-2 col-form-label">Number of People</label>
        <div className="col-sm-10">
          <input
            name="people"
            type="number"
            min={1}
            value={reservation.people}
            onChange={changeHandlerNumber}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
      {" "}
      <button type="button" className="btn btn-danger" onClick={history.goBack}>
        Cancel
      </button>
    </form>
  );
}

export default ReservationForm;