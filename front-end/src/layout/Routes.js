//react hooks
import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

// Route Imports 
import ReservationNew from "../reservations/ReservationNew";
import CreateTable from "../tables/CreateTable";
import SeatTable from "../component/seatTable";
import Search from "../dashboard/Search";
import Dashboard from "../dashboard/Dashboard";
import ReservationEdit from "../reservations/ReservationEdit";
import ReservationStatus from "../reservations/ReservationStatus";

//utils
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery"

//error handler
import NotFound from "./NotFound";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {

  const query = useQuery();
  const date = query.get("date");
  
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/new">
        <ReservationNew />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatTable />
      </Route>
      <Route path="/reservations/:reservation_id/status">
        <ReservationStatus />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <ReservationEdit />
      </Route>
      <Route exact={true} path="/tables">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/tables/new">
        <CreateTable />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date || today()} />
      </Route>
      <Route exact={true} path="/search">
        <Search />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  )
}

export default Routes;