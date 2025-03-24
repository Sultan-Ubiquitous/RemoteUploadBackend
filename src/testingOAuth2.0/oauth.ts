import express, {Request, Response, Application} from "express";

const app: Application = express();
const PORT = process.env.OAUTH_PORT || 8080;

app.use(express.json());



app.listen(PORT, () => {
    console.log(`Server be running on http://localhost:${PORT}`);
});