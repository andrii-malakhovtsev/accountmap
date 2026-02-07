// Bring in required modules and libraries
import { prisma } from "./lib/prisma";
import { app, get_default_user } from "./lib/utils";

import routes from "./routes/index.route";

const DEFAULT_USER = "default";
const PORT = process.env.PORT || 8081;


app.get("/", (_, res) => {
	res.json({
		message: "Welcome to the Full-Stack Demo API",
	});
});

app.use("/api", routes);

async function load_default_user() {
	const user = await get_default_user();
	if (user) return;
	await prisma.user.create({
		data: {
			email: "default@example.com",
			password: "default",
			username: "default",
		},
	});
}

load_default_user().then(() => {
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
});


process.on("SIGTERM", async () => {
	console.log("SIGTERM received, closing connections...");
	await prisma.$disconnect();
	process.exit(0);
});
