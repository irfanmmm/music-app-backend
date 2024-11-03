const NotificationSercvice = require("./../../farebase/NotificationService");
const notification = async (req, res) => {
  let title = req.body.title;
  let body = req.body.body;
  let devicetoken = req.body.devicetoken;
  try {
    await NotificationSercvice.sendNotification(devicetoken, title, body);
    res.status(200).json({
      status: true,
      message: "Notification send success full",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error sending Notifications " + error?.toString(),
    });
  }
};

module.exports = notification;
