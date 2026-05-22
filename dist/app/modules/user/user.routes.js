import express, {} from 'express';
const router = express.Router();
// router.get('/', userController.getAllUsersFromDB);
// router.get('/:id', userController.getSingleUserFromDB);
router.delete('/:id');
router.post('/register');
export const userRouter = router;
//# sourceMappingURL=user.routes.js.map