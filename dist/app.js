import express from 'express';
const app = express();
app.get('/', (req, res) => {
    res.send('Hello World...!');
});
export default app;
export function listen(port, arg1) {
    throw new Error("Function not implemented.");
}
//# sourceMappingURL=app.js.map