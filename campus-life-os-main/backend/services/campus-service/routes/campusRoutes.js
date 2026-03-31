import { registerCampusServiceController } from "../controller/campusController.js"

export const registerCampusServiceRoutes = (app) => {
  registerCampusServiceController(app)
}
