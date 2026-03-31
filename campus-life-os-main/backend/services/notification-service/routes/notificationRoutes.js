import { registerNotificationServiceController } from "../controller/notificationController.js"

export const registerNotificationServiceRoutes = (app) => {
  registerNotificationServiceController(app)
}
