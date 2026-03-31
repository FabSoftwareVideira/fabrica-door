require("dotenv").config();

const createApp = require("./app");
const port = Number(process.env.PORT || 8000);
const app = createApp();

app.listen(port, () => {
    console.log(`Servidor iniciado em http://localhost:${port}`);
});