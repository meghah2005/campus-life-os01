import { registerStudentServiceController } from "../controller/studentController.js"

export const registerStudentServiceRoutes = (app) => {
  registerStudentServiceController(app)
}
