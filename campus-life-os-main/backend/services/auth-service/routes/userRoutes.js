import { registerAuthServiceController } from "../controller/userController.js"

export const registerAuthServiceRoutes = (app) => {
  registerAuthServiceController(app)
}
