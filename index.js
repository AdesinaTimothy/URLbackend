import "dotenv/config"

import express  from "express"
import cors from "cors"
// import {authenticationMiddleware} from "./middlewares/auth.middleware.js"
import urlRouter from "./routes/url.route.js"

import userRouter from "./routes/user.route.js"

const app = express()
const PORT = process.env.PORT ?? 8000;
app.use(cors({
    origin: "https://urlfrontend-af6t.vercel.app", 
    credentials: true,               
  }));

app.use(express.json())



app.get("/", (req, res) => {
    return res.json({ status: `Server is up and running...${PORT}`})
}) 

app.use(urlRouter);
app.use("/user", userRouter)


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
});

