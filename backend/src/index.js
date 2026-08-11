import "./env.js";
import app from "./app.js";
import connectDB from "./config/db.js";

const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error(`MongoDB connection error: ${err}`);
    process.exit(1);
  });
