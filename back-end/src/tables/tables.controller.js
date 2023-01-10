const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

/*---------------- Validation Middleware ----------------*/

//table exists
async function tableExists(req, res, next) {
  const { table_id } = req.params;

  const foundTable = await service.read(table_id);
  if (foundTable) {
    res.locals.table = foundTable;
    return next();
  }
  next({
    status: 404,
    message: `table with an id of ${table_id} cannot be found.`,
  });
}

//reservation by id
async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const foundReservation = await reservationsService.read(reservation_id);

  if (foundReservation) {
    res.locals.reservation = foundReservation;
    return next();
  }
  next({
    status: 404,
    message: `A reservation with an ID of ${reservation_id} could not be found`,
  });
}

//name length
function validateName(req, res, next) {
  const { data = {} } = req.body;
  if (!data.table_name || data.table_name.length < 2) {
    return next({
      status: 400,
      message: `table_name must be at least two characters`,
    });
  }
  next();
}

//capacity
function validateCapacity(req, res, next) {
  const { data = {} } = req.body;
  if (!data.capacity || typeof data.capacity !== "number") {
    return next({
      status: 400,
      message: `capacity must be a number greater than one`,
    });
  }
  next();
}

//table is occupied
function validateOccupied(req, res, next) {
  const { reservation_id } = res.locals.table;
  if (!reservation_id) {
    return next({
      status: 400,
      message:
        "Table is not occupied, please pick an occupied table to free up",
    });
  }
  next();
}

//not occupied
async function validateNotOccupied(req, res, next) {
  const { table } = res.locals;
  const { reservation } = res.locals;

  if (table.reservation_id) {
    return next({
      status: 400,
      message: `Table is occupied, it has a reservation_id`,
    });
  } else if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: `Too many people to fit tables maximum capacity, choose another table`,
    });
  } else {
    next();
  }
}

//not seated
function validateNotSeated(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "seated") {
    return next({
      status: 400,
      message: "table currently seated, pick an open table please",
    });
  }
  next();
}

/*---------------- Validate form data ----------------*/
//properties
const validateProperties = hasProperties("table_name", "capacity");

/*---------------- Route  Handlers ----------------*/
async function list(req, res) {
  res.json({ data: await service.list() });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function read(req, res) {
  res.json({ data: res.locals.table });
}

async function seatTable(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { table_id } = res.locals.table;

  const data = await service.seatTable(table_id, reservation_id);
  res.json({ data });
}

async function finishTable(req, res) {
  const { table_id } = req.params;
  const { reservation_id } = res.locals.table;

  const data = await service.finishTable(table_id, reservation_id);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    validateProperties,
    validateName,
    validateCapacity,
    asyncErrorBoundary(create),
  ],
  read: [tableExists, asyncErrorBoundary(read)],
  seatTable: [
    hasProperties("reservation_id"),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    validateNotOccupied,
    validateNotSeated,
    asyncErrorBoundary(seatTable),
  ],
  finishTable: [
    asyncErrorBoundary(tableExists),
    validateOccupied,
    asyncErrorBoundary(finishTable),
  ],
};
