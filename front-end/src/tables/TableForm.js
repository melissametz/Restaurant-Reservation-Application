//react hooks
import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";

// utility function and error handler
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TableForm() {
  const history = useHistory();
  const [error, setError] = useState(null);

  //new form
  const initialState = {
    table_name: "",
    capacity: 0,
  };

  const [table, setTable] = useState(initialState);

  function changeHandler({ target: { name, value } }) {
    setTable((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  //capacity
  function changeHandlerNum({ target: { name, value } }) {
    setTable((prevState) => ({
      ...prevState,
      [name]: Number(value),
    }));
  }

  function submitHandler(event) {
    event.preventDefault();

    createTable(table)
      .then(() => {
        history.push("/");
      })
      .catch(setError);
  }

  return (
    <main>
      <ErrorAlert error={error} />
      <p>Create A New Table</p>
      <form onSubmit={submitHandler}>
        <div>
          <div>
            <label className="form-label" htmlFor="table_name">
              Table Name
            </label>
            <input
              className="form-control"
              id="table_name"
              name="table_name"
              type="text"
              min="2"
              value={table.table_name}
              onChange={changeHandler}
              required={true}
            />
            <small className="form-text text-muted">
              Table Name must have at least two characters.
            </small>
          </div>

          <div>
            <label className="form-label" htmlFor="capacity">
              Capacity
            </label>
            <input
              className="form-control"
              id="capacity"
              name="capacity"
              type="number"
              value={table.capacity}
              onChange={changeHandlerNum}
              required={true}
            />
            <small className="form-text text-muted">
              Table must have a capacity of at least one person.
            </small>
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-secondary mr-2"
            onClick={history.goBack}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}

export default TableForm;