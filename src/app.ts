import express from 'express'

import trackerRoute from './tracker'

const app = express();

app.use("/announce",trackerRoute)

// app.get("*", (req, res) => {
//   console.log(req)
//   res.send("Hello world");
// });


export default app;