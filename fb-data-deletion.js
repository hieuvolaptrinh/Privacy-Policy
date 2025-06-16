/**
 * Facebook Data Deletion Callback Endpoint
 *
 * Endpoint này được tạo để tuân thủ yêu cầu của Facebook về việc xóa dữ liệu người dùng
 * khi họ hủy kết nối ứng dụng với tài khoản Facebook của mình.
 */

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để parse JSON body
app.use(express.json());

// Middleware để log requests (optional - cho development)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// CORS headers (nếu cần thiết)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

/**
 * Facebook Data Deletion Callback Endpoint
 *
 * Facebook sẽ gọi endpoint này khi người dùng hủy kết nối ứng dụng
 * và yêu cầu xóa dữ liệu của họ.
 *
 * Format request từ Facebook:
 * {
 *   "user_id": "facebook_user_id_here",
 *   "challenge": "unique_challenge_string"
 * }
 *
 * Format response yêu cầu:
 * {
 *   "url": "https://yourdomain.com/fb-data-deletion",
 *   "confirmation_code": "challenge_string_from_request"
 * }
 */
app.post("/fb-data-deletion", async (req, res) => {
  try {
    console.log("Facebook Data Deletion Request received:", req.body);

    // Lấy thông tin từ request body
    const { user_id, challenge } = req.body;

    // Validate input
    if (!user_id || !challenge) {
      return res.status(400).json({
        error: "Missing required fields",
        message: "Both user_id and challenge are required",
      });
    }

    // ===========================================
    // XÓA DỮ LIỆU NGƯỜI DÙNG KHỎI DATABASE
    // ===========================================

    console.log(`Starting data deletion process for user_id: ${user_id}`);

    try {
      // TODO: Thay thế code dưới đây bằng logic xóa dữ liệu thực tế của bạn

      // Ví dụ với MongoDB:
      // await User.findOneAndDelete({ facebookId: user_id });
      // await UserProfile.deleteMany({ userId: user_id });
      // await Orders.deleteMany({ userId: user_id });
      // await UserPreferences.deleteMany({ userId: user_id });

      // Ví dụ với MySQL/PostgreSQL:
      // await db.query('DELETE FROM users WHERE facebook_id = ?', [user_id]);
      // await db.query('DELETE FROM user_profiles WHERE user_id = ?', [user_id]);
      // await db.query('DELETE FROM orders WHERE user_id = ?', [user_id]);
      // await db.query('DELETE FROM user_preferences WHERE user_id = ?', [user_id]);

      // Ví dụ với Firebase:
      // await admin.firestore().collection('users').where('facebookId', '==', user_id).get()
      //     .then(snapshot => {
      //         const batch = admin.firestore().batch();
      //         snapshot.docs.forEach(doc => batch.delete(doc.ref));
      //         return batch.commit();
      //     });

      // SIMULATE DATA DELETION (Xóa dòng này khi implement thực tế)
      await simulateDataDeletion(user_id);

      console.log(
        `Data deletion completed successfully for user_id: ${user_id}`
      );
    } catch (deletionError) {
      console.error("Error during data deletion:", deletionError);

      // Có thể ghi log lỗi vào file hoặc database để theo dõi
      // await logError('DATA_DELETION_FAILED', { user_id, error: deletionError.message });

      // Trả về lỗi 500 nếu không thể xóa dữ liệu
      return res.status(500).json({
        error: "Data deletion failed",
        message: "Unable to delete user data from our systems",
      });
    }

    // ===========================================
    // TRẢ VỀ RESPONSE THEO FORMAT FACEBOOK YÊU CẦU
    // ===========================================

    const response = {
      url: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
      confirmation_code: challenge,
    };

    console.log("Sending response to Facebook:", response);

    // Trả về HTTP 200 với format JSON yêu cầu
    res.status(200).json(response);

    // Optional: Log thành công vào database
    // await logDataDeletionSuccess(user_id, challenge);
  } catch (error) {
    console.error("Unexpected error in fb-data-deletion endpoint:", error);

    // Trả về lỗi 500 cho các lỗi không mong muốn
    res.status(500).json({
      error: "Internal server error",
      message: "An unexpected error occurred while processing the request",
    });
  }
});

/**
 * Health Check Endpoint
 * Để kiểm tra server có hoạt động không
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Facebook Data Deletion Service is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/**
 * Root endpoint - thông tin về service
 */
app.get("/", (req, res) => {
  res.status(200).json({
    service: "Facebook Data Deletion Callback",
    version: "1.0.0",
    description: "This service handles Facebook data deletion requests",
    endpoints: {
      "POST /fb-data-deletion": "Facebook data deletion callback",
      "GET /health": "Health check endpoint",
      "GET /privacy-policy": "Privacy policy page",
    },
  });
});

/**
 * Privacy Policy Endpoint
 * Redirect hoặc serve privacy policy page
 */
app.get("/privacy-policy", (req, res) => {
  // Option 1: Redirect đến privacy policy HTML file
  res.redirect("/privacy-policy.html");

  // Option 2: Serve trực tiếp file HTML (nếu bạn dùng express.static)
  // res.sendFile(path.join(__dirname, 'public', 'privacy-policy.html'));
});

/**
 * Serve static files (HTML, CSS, JS)
 * Uncomment dòng dưới nếu bạn muốn serve file HTML trực tiếp
 */
// app.use(express.static('public'));

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong!",
  });
});

/**
 * 404 Handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.method} ${req.path} not found`,
  });
});

/**
 * SIMULATION FUNCTION - XÓA KHI IMPLEMENT THỰC TẾ
 * Hàm này chỉ để mô phỏng quá trình xóa dữ liệu
 */
async function simulateDataDeletion(userId) {
  console.log(`[SIMULATION] Deleting data for user: ${userId}`);

  // Simulate database operations with delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(`[SIMULATION] Deleted user profile for: ${userId}`);
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log(`[SIMULATION] Deleted user orders for: ${userId}`);
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log(`[SIMULATION] Deleted user preferences for: ${userId}`);
  await new Promise((resolve) => setTimeout(resolve, 300));

  console.log(`[SIMULATION] Data deletion completed for: ${userId}`);
}

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log("🚀 Facebook Data Deletion Service Started");
  console.log("=".repeat(50));
  console.log(`🌐 Server running on port: ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🗑️  Data deletion: http://localhost:${PORT}/fb-data-deletion`);
  console.log(`📋 Privacy policy: http://localhost:${PORT}/privacy-policy`);
  console.log("=".repeat(50));

  if (process.env.NODE_ENV !== "production") {
    console.log("⚠️  WARNING: This is a development server");
    console.log("🔒 For production, make sure to:");
    console.log("   1. Use HTTPS (required by Facebook)");
    console.log("   2. Configure proper environment variables");
    console.log("   3. Implement actual database deletion logic");
    console.log("   4. Set up proper logging and monitoring");
    console.log("=".repeat(50));
  }
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

module.exports = app;
