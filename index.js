const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const connection = require("./config/db");
const { userRouter } = require("./routes/user.route");
const { blogRoute } = require("./routes/blog.route");


const port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use('/api',userRouter)
app.use('/api',blogRoute)
app.get("/", (req, res) => {
  res.send("Server running");
});



(async function(){
try {
  await connection;
  console.log("Connected to DB");
  app.listen(port, async () => {
    console.log(`Server is running at the port: ${port}`);
  });
} catch (error) {
  console.log("Error connecting to server or Database");
  console.log(error);
}
})();

