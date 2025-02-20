const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://flowtask-arijit.web.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tbvw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const taskCollection = client.db("flowTask").collection("taskCollection");
    const userCollection = client.db("flowTask").collection("userCollection");

    app.get("/users", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });
    app.post("/users", async (req, res) => {
      const { email, displayName } = req.body;

      if (!email || !displayName) {
        return res
          .status(400)
          .json({ message: "Email and displayName are required" });
      }
      const existingUser = await userCollection.findOne({ email });
      if (existingUser) {
        return res
          .status(200)
          .json({ message: "User already exists", user: existingUser });
      }

      const newUser = { email, displayName };
      await userCollection.insertOne(newUser);
      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    });
    //! tasks
    app.get("/tasks/:email", (req, res) => {
      const { email } = req.params;
      taskCollection
        .findOne({ userEmail: email })
        .then((user) => {
          if (user) {
            res.status(200).json({ tasks: user.tasks });
          } else {
            res.status(404).json({ error: "User not found" });
          }
        })
        .catch((err) =>
          res.status(500).json({ error: "Failed to fetch tasks" })
        );
    });
    app.post("/tasks", (req, res) => {
      const { email, title, description, category } = req.body;
      taskCollection
        .findOne({ userEmail: email })
        .then((user) => {
          if (user) {
            const nextTaskId = user.tasks.length + 1;
            const newTask = {
              id: nextTaskId,
              title,
              description,
              category,
              timestamp: new Date(),
            };
            taskCollection
              .updateOne({ userEmail: email }, { $push: { tasks: newTask } })
              .then(() =>
                res
                  .status(201)
                  .json({ message: "Task added successfully", task: newTask })
              )
              .catch((err) =>
                res.status(500).json({ error: "Failed to add task" })
              );
          } else {
            const newTask = {
              id: 1,
              title,
              description,
              category,
              timestamp: new Date(),
            };

            const newUser = {
              userEmail: email,
              tasks: [newTask],
            };

            taskCollection
              .insertOne(newUser)
              .then(() =>
                res
                  .status(201)
                  .json({ message: "Task added successfully", task: newTask })
              )
              .catch((err) =>
                res.status(500).json({ error: "Failed to add task" })
              );
          }
        })
        .catch((err) =>
          res.status(500).json({ error: "Failed to check user" })
        );
    });
    app.delete("/tasks/:taskId", (req, res) => {
      const { email } = req.body;
      const { taskId } = req.params;
      taskCollection
        .findOne({ userEmail: email })
        .then((user) => {
          if (user) {
            const taskIndex = user.tasks.findIndex((task) => task.id == taskId);
            if (taskIndex !== -1) {
              user.tasks.splice(taskIndex, 1);
              taskCollection
                .updateOne(
                  { userEmail: email },
                  { $set: { tasks: user.tasks } }
                )
                .then(() =>
                  res.status(200).json({ message: "Task deleted successfully" })
                )
                .catch((err) =>
                  res.status(500).json({ error: "Failed to delete task" })
                );
            } else {
              res.status(404).json({ error: "Task not found" });
            }
          } else {
            res.status(404).json({ error: "User not found" });
          }
        })
        .catch((err) =>
          res.status(500).json({ error: "Failed to check user" })
        );
    });
    app.put("/tasks/:taskId", (req, res) => {
      const { taskId } = req.params;
      const { userEmail, title, description, category } = req.body;
      console.log(req.body, taskId);
      taskCollection
        .updateOne(
          {
            userEmail,
            "tasks.id": parseInt(taskId),
          },
          {
            $set: {
              "tasks.$.title": title,
              "tasks.$.description": description,
              "tasks.$.category": category,
            },
          }
        )
        .then((result) => {
          if (result.matchedCount > 0) {
            res.status(200).json({ message: "Task updated successfully" });
          } else {
            res.status(404).json({ error: "Task not found" });
          }
        })
        .catch((err) => {
          res.status(500).json({ error: "Failed to update task" });
        });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server side ready");
});

app.listen(port, () => {
  console.log("server running in the port :", port);
});
