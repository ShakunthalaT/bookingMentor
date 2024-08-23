const express = require("express");
const path = require("path");
const bp = require("body-parser");
const cors = require("cors");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
const dbPath = path.join(__dirname, "bookingData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

app.post("/mentors/", async (request, response) => {
  const {
    id,
    name,
    availability,
    areas_of_expertise,
    is_premium,
  } = request.body;
  const getMentors = `
  INSERT INTO
    mentor(id, name, availability, areas_of_expertise, is_premium)
  VALUES
    ('${id}', '${name}', '${availability}','${areas_of_expertise}','${is_premium}');`;
  await db.run(getMentors);
  response.send("Mentors Successfully Added");
});

app.get("/mentors/", async (request, response) => {
  const getAllMentors = `
    SELECT
      *
    FROM
      mentor;`;
  const mentorsArray = await db.all(getAllMentors);
  response.send(mentorsArray);
});

app.post("/booking/", async (request, response) => {
  const { name, email, phone_number, state } = request.body;
  const getNewBooking = `
  INSERT INTO
     booking(name, email, phone_number, state)
  VALUES
    ('${name}', '${email}', '${phone_number}','${state}');`;
  await db.run(getNewBooking);
  response.send("NewBooking Successfully Added");
});

app.get("/booking/", async (request, response) => {
  const getAllBookings = `
    SELECT
      *
    FROM
      booking;`;
  const getBooking = await db.all(getAllBookings);
  response.send(getBooking);
});
