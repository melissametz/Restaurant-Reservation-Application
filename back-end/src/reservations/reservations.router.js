/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//edit reservation id
router
  .route("/:reservation_id/edit")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

//status for reservation id
router
  .route("/:reservation_id/status")
  .get(controller.read)
  .put(controller.updateStatus)
  .all(methodNotAllowed);

//reservation id
router
  .route("/:reservation_id")
  .get(controller.read)
  .put(controller.update)
  .all(methodNotAllowed);

//root
router
  .route("/")
  .get(controller.list)
  .post(controller.create)
  .all(methodNotAllowed);

module.exports = router;
