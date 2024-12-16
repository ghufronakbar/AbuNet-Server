import {
  resClientError,
  resNotAllowed,
  resServerError,
  resSuccess,
} from "@/helper/response";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      // Verifikasi signature key dari Midtrans
      const { order_id, transaction_status, fraud_status } = req.body;

      // Update status transaksi di database
      let status;
      if (transaction_status === "settlement" && fraud_status === "accept") {
        const now = new Date().now()
        await paidTransaction(order_id, now, now);
        status = "Paid"; // Success
      } else if (transaction_status === "pending") {
        status = "Pending"; // Pending
      } else if (
        transaction_status === "deny" ||
        transaction_status === "expire" ||
        transaction_status === "cancel"
      ) {
        await cancelTransaction(order_id);
        status = "Cancel"; // cancelled
      }

      if (!status) {
        return res
          .status(400)
          .json(resClientError("Invalid transaction status."));
      }


      return res
        .status(200)
        .json(resSuccess("Transaction status updated.", status));
    }

    return res.status(405).json(resNotAllowed());
  } catch (error) {
    console.error("Webhook Error:", error);
    return res.status(500).json(resServerError("Failed to process webhook."));
  }
}
