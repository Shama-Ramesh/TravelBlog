const express = require('express');
const dbConnection = require('./db');
const cors = require('cors');

// app is the instance of express
const app = express();

const PORT = 7000;
app.use(express.json());

// Calling database connection
dbConnection();
app.use(cors());

app.get('/', (req, res) => {
    res.send("It's my first API");
});

app.use("/api/category", require('./route/categoryRoute'));
app.use("/api/user", require('./route/userRoute'));
app.use("/api/subcategory", require('./route/subcategoryRoute'));
app.use("/api/blog", require('./route/blogRoute'));
app.use("/api/bucketlist", require('./route/bucketlistRoute'));
app.use("/api/comment",require('./route/commentRoute'));
app.use("/api/report",require('./route/reportRoute'));
app.use("/api/bookmark", require('./route/bookmarkRoute'));

app.use('/api/dashboard',require('./route/countRoute'));



app.use("/api/image",express.static('./uploads/images'))
app.use("/api/user-image",express.static('./uploads/'))
app.use("/api/videos",express.static('./uploads/videos'))



app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});
