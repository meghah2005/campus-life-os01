import { registerTasksServiceController } from "../controller/taskController.js"

export const registerTasksServiceRoutes = (app) => {
  registerTasksServiceController(app)
}
