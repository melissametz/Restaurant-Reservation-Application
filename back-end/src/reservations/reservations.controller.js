const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

/*---------------- Validation Middleware ----------------*/
//reservation exists
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params || req.body.data
  const foundReservation = await service.read(reservation_id)
  if (foundReservation) {
    res.locals.reservation = foundReservation
    return next();
  }
  next({
    status: 404,
    message: `reservation with an ID of ${reservation_id} could not be found.`
  })
}

//is time available
function timeAvailable(req, res, next) {
  const { data = {} } = req.body;

  if (
    /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(data["reservation_time"]) ||
    /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(
      data["reservation_time"]
    )
  ) {
    if (data["reservation_time"] < "10:30") {
      return next({
        status: 400,
        message: "restaurant is not open until 10:30AM",
      });
    }
    if (data["reservation_time"] > "21:30") {
      return next({
        status: 400,
        message: "cannot schedule a reservation after 9:30pm",
      });
    }
    return next();
  }
  next({ status: 400, message: `Invalid reservation_time` });
}

//time format
async function validateTimeFormat(req, res, next) {
    const time = req.body.data.reservation_time;
    const isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(
      time
    );
    if (!isValid) {
      return next({
        status: 400,
        message: `The time you entered is not valid. Please enter a valid reservation_time`,
      });
    }
  next();
}

//date format
async function validateDateFormat(req, res, next) {
  const { data = {} } = req.body;
  const date = new Date(data.reservation_date)
  const day = date.getUTCDay()
  const newDate = new Date()

  if (!Date.parse(date)) {
    next({
      status: 400,
      message: "reservation_date must be a valid date format!"
    })
  }
  if (day === 2) {
    return next({
      status: 400,
      message: `Restaurant closed on Tuesday, please choose a different day of the week.`
    })
  }
  if (
    JSON.stringify(date).slice(1, 11) < JSON.stringify(newDate).slice(1, 11) &&
    JSON.stringify(date).slice(12, 24) < JSON.stringify(newDate).slice(12, 24)
  ) {
    return next({
      status: 400,
      message: `Reservation must be a future date.`
    })
  }

  next();
}


//people as integer
function validatePeople(req, res, next) {
  const { data = {} } = req.body;

  if (!data.people || typeof data.people !== "number") {
    return next({ 
      status: 400, 
      message: `Invalid: people must be an integer greater than zero` 
    });
  }

  next();
}

//not seated status
function checkStatus(req, res, next) {
  const { status } = req.body.data;

  if (status === "seated") {
    return next({ status: 400, message: `reservation is seated` });
  }

  if (status === "finished") {
    return next({ status: 400, message: `reservation is finished` });
  }

  next();
}

/*---------------- validate form submission ----------------*/

//status list
const validStatus = ["booked", "finished", "seated", "cancelled"];

//status
function hasValidStatus(req, res, next) {
  const { status } = req.body.data;

  if (!validStatus.includes(status)) {
    return next({ 
      status: 400,
      message: "unknown status submission" 
    });
  }
  next();
}

//properties
const hasValidProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

//validations
const validFields = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

//fields
function hasValidFields(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !validFields.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }

  next();
}

/*---------------- Route Handlers ----------------*/

// list reservations
async function list(req, res) {
  const { date, mobile_number } = req.query
  const data = await (
    mobile_number 
    ? service.search(mobile_number)
    : service.list(date)
  )
  res.json({ data });
}

//new reservation
async function create(req, res) {
  const data = await service.create(req.body.data)
  res.status(201).json({ data })
}

//read reservation 
function read(req, res) {
  res.json({ data: res.locals.reservation })
}

//update unfinished reservation
async function update(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: req.params.reservation_id,
    status: req.body.data.status,
  };

  if (res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: "a finished reservation cannot be updated",
    });
  }

  const data = await service.update(updatedReservation);
  res.status(200).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasValidProperties,
    validateDateFormat,
    validateTimeFormat,
    validatePeople,
    timeAvailable,
    checkStatus,
    asyncErrorBoundary(create)
  ],
  read: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(read)
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasValidFields,
    hasValidProperties,
    validatePeople,
    validateDateFormat,
    validateTimeFormat,
    timeAvailable,
    hasValidStatus,
    hasValidFields,
    asyncErrorBoundary(update)
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    hasValidFields,
    hasValidStatus,
    asyncErrorBoundary(update)
  ]
};