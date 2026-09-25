import { app } from "./app.js";
import { connectDB } from "./db/connect.js";
import { env } from "./config/env.js";

async function start() {
    try {
        await connectDB();
        app.listen(env.PORT, () => {
            console.log(`Server is running on port ${env.PORT}`);
        });
    } catch (error) {
        console.log("Error starting server: ", error);
        process.exit(1);
    }
}

start();