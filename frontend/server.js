import dotenv from "dotenv";
import express from "express";
import path from "path";
import session from "express-session";
import sessionConfig from "./config/sessionConfig.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(session(sessionConfig));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/dashboard", (req, res) => {
	if (req.session.loggedIn) {
		res.sendFile(path.join(__dirname, "public", "dashboard.html"));
	} else {
		res.redirect("/");
	}
});

app.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).json({ message: "Error logging out" });
		}
		res.redirect("/");
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
