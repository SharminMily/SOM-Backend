import express, { type NextFunction, type Request, type Response } from 'express';
import { userController } from './user.controller.js';


const router = express.Router();


router.get('/', userController.getAllUsersFromDB);
router.get('/:id', userController.getSingleUserFromDB);
router.delete('/', userController.deleteUserFromDB);
router.post('/', userController.createUserIntoDB);


// router.get('/:id', userController.getSingleUserFromDB);
// router.delete(
//   '/:id',
//   auth(Role.ADMIN),
//   userController.deleteUserFromDB,
// );
// router.post(
//   '/register',
//   fileUploads.upload.single('file'),
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const parsedData = JSON.parse(req.body.data);
//       if (req.file) {
//         // parsedData.profileImage = `${process.env.SERVER_URL}/uploads/${req.file.filename}`;
//         const cloudinaryRes = await fileUploads.uploadToCloudinary(req.file)
//         // console.log('Cloudinary result:', cloudinaryRes);

//         parsedData.profileImage=cloudinaryRes.secure_url
//       }

//       const validatedData = createUserZodSchema.parse(parsedData);
//       req.body = validatedData;
//       // console.log(req.body)
//       return userController.createUserIntoDB(req, res, next);
//     } catch (error) {
//       next(error);
//     }
//   },
// );

export const userRouter = router;
