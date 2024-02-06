import {
  withTransaction,
  errorHandler,
  HttpError,
} from "../../utils/api-utils";
import { models } from "../../models";
import moment from "moment";

export default errorHandler(
  withTransaction(async (req, res) => {
    const { userId } = req.query;

    try {
      const workerSpentTime = await models.WorkStatus.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%m-%d",
                date: "$createdAt",
              },
            },
            totalSpentTime: { $sum: "$spentMinutes" },
          },
        },
      ]);

      // 7 hongiin hugatsag oruulah hvsnegt
      const formattedData = Array.from({ length: 7 }, (_, index) => {
        const currentDate = moment().subtract(index, "days");
        return currentDate.format("MM-DD");
      });

      const resultData = formattedData.map((date) => {
        const entry = workerSpentTime.find((item) => item._id === date);
        return entry ? entry.totalSpentTime : 0;
      });

      res.status(200).json(resultData.reverse());
    } catch (error) {
      console.error("Error fetching worker spent time:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  })
);
