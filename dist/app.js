import express from 'express';
import status from 'http-status';
import router from './app/routes/index.js';
import notFound from './app/middlewares/notFound.js';
import globalErrorHandler from './app/middlewares/globalErrorhandler.js';
const app = express();
app.get('/', (req, res) => {
    res.status(status.OK).json({
        success: true,
        message: 'Server Is Running',
    });
});
app.use('/api/v1', router);
app.use(notFound);
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map