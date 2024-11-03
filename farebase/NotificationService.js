const admin = require("./farebase");

class NotificationSercvice {
  static async sendNotification(devicetoken, title, body) {
    const message = {
      notification: {
        title,
        body,
      },
      token: devicetoken,
    };
    try {
      const response = await admin.messaging().send(message);

      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = NotificationSercvice;
