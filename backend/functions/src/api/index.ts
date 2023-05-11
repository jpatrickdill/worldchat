import express from "express";
import cors from "cors";
import translate from "./translate";
import threads from "./threads";
import profileRoutes from "./profile";

const app = express();

app.use(cors({origin: true}));
app.use("/translate", translate);
app.use("/threads", threads);
app.use("/profile", profileRoutes);

export default app;