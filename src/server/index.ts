import express from "express";
import rootRoutes from "./routes/root"

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", rootRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});