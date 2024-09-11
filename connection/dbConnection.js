import mongoose from "mongoose";
import consola from "consola";

const dbConnection = () => {
    return mongoose
        .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
        .then((result) =>
            consola.success({ message: "Database Connected", badge: true })
        )
        .catch((err) =>
            consola.error({
                message: "Unable to connect to database.",
                badge: true,
            })
        );
};

export default dbConnection;
