//react hooks
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";

// utililty functions and error handlers
import { listTables, seatTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

//seat table
export default function SeatTable() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const reservationId = Number(reservation_id);

  //state hooks for tableId, updateTableError, and tables
  const [tableId, setTableId] = useState("");
  const [updateTableError, setUpdateTableError] = useState(null);
  const [tables, setTables] = useState([]);

  useEffect(loadTables, [reservationId]);

  function loadTables() {
    const abortController = new AbortController();

    setUpdateTableError(null);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setUpdateTableError);

    return () => abortController.abort();
  }

  const rows = tables.map((table) => {
    return (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  const changeHandler = ({ target }) => {
    setTableId(Number(target.value));
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const abortController = new AbortController();

    setUpdateTableError(null);

    seatTable(reservation_id, tableId, abortController.signal)
      .then(() => {
        history.push("/");
      })
      .catch(setUpdateTableError);
    return () => abortController.abort();
  };

  return (
    <div>
      <div>Seat A Table</div>
      <ErrorAlert error={updateTableError} />

      <form onSubmit={submitHandler}>
        <div className="form-row align-items-center">
          <div className="col-auto my-1">
            <select
              className="custom-select mr-sm-2"
              name="table_id"
              required
              onChange={changeHandler}
            >
              <option defaultValue={0}>Choose...</option>
              {rows}
            </select>
          </div>

          <div className="col-auto my-1">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={history.goBack}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}