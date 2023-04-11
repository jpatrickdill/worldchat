import express from "express";
import cors from "cors";
import translate from "./translate";
import threads from "./threads";

const app = express();

app.use(cors({origin: true}));
app.use("/translate", translate);
app.use("/threads", threads);

export default app;