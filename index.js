import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "http://numbersapi.com/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Homepage
app.get("/", (req, res) => {
  res.render("index");
});

// Fact type pages
app.get("/number", (req, res) => {
  res.render("fact", { type: "number", fact: null });
});

app.get("/date", (req, res) => {
  res.render("fact", { type: "date", fact: null });
});

app.get("/year", (req, res) => {
  res.render("fact", { type: "year", fact: null });
});

app.get("/math", (req, res) => {
  res.render("fact", { type: "math", fact: null });
});

// Get fact with user input (POST)
app.post("/fact/:type", async (req, res) => {
  const { type } = req.params;
  const { inputValue } = req.body;

  try {
    let url = "http://numbersapi.com/";

    switch (type) {
      case "number":
      case "math":
        url += inputValue;
        if (type === "math") url += "/math";
        break;
      case "date":
        url += inputValue + "/date";
        break;
      case "year":
        url += inputValue + "/year";
        break;
      default:
        return res.redirect("/");
    }

    const response = await axios.get(url);
    res.render("fact", { type, fact: response.data });
  } catch {
    res.render("fact", {
      type,
      fact: "Oops! Something went wrong. Try again.",
    });
  }
});

app.get("/fact/:type", (req, res) => {
  const type = req.params.type;
  res.render("fact", { type, fact: null });
});

// Get random fact (GET)
app.get("/fact/:type/random", async (req, res) => {
  let type = req.params.type;
  let apiUrl = "";

  try {
    if (type === "date") {
      const month = Math.floor(Math.random() * 12) + 1;
      const day = Math.floor(Math.random() * 28) + 1;
      apiUrl = `http://numbersapi.com/${month}/${day}/date?json`;
    } else if (type === "year") {
      const year = Math.floor(Math.random() * (2025 - 1000)) + 1000;
      apiUrl = `http://numbersapi.com/${year}/year?json`;
    } else {
      const apiType = type === "number" ? "trivia" : type;
      apiUrl = `http://numbersapi.com/random/${apiType}?json`;
    }

    const response = await axios.get(apiUrl);
    const fact = response.data.text;

    res.render("fact", { type, fact });
  } catch (error) {
    res.render("fact", {
      type,
      fact: "Oops! Something went wrong. Try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
