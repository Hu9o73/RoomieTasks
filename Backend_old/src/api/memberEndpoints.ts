import { Router, Request, Response } from 'express'
import { authenticate, authorizeRoles } from './AuthenticationControllers/authMiddleware';
import { User } from '../ConfigFiles/dbAssociations';
import bcrypt from 'bcryptjs';

const router = Router();

router.get('/whoAmI', authenticate, async (req: Request & { user?: any }, res: Response) => {
    const userId = req.user.id;

    try {
        if (userId) {
            const user = await User.findOne({ where: { id: userId } });
            res.status(200).json({
                userId: user?.id,
                userNickname: user?.nickname,
                userFirstName: user?.firstName,
                userLastName: user?.lastName,
                userEmail: user?.email,
                userSchool: user?.school,
                userYear: user?.year,
                userProgram: user?.program,
                userRole: user?.role
            });
            return;
        } else {
            console.error("Invalid userId");
            res.status(400).json({ error: "Invalid userId" });
            return;
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error when fetching whoAmI." });
        return;
    }

});


router.post('/verifyPwd',
    authenticate,
    async (req: Request & { user?: any }, res: Response) => {
        try {
            const userId = req.user.id;

            if (!userId) {
                res.status(404).json({ error: "UserId not found." });
                return;
            }

            const user = await User.findOne({ where: { id: userId } });

            if (user) {
                const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
                if (isPasswordValid == true) {
                    res.status(200).json({ validPass: true, message: "Passwords do match !" });
                    return;
                } else {
                    res.status(200).json({ validPass: false, message: "Passwords do not match !" });
                    return;
                }
            } else {
                res.status(404).json({ error: "User not found." });
                return;
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occured while modifying the user." });
            return;
        }
    });


router.put('/modifyMe',
    authenticate,
    async (req: Request & { user?: any }, res: Response) => {
        try {
            const userId = req.user.id;

            if (!userId) {
                res.status(404).json({ error: "UserId not found." });
                return;
            }

            const user = await User.findOne({ where: { id: userId } });

            if (user) {
                const { nickname, email, school, program, year } = req.body;
                if (nickname) user.nickname = nickname;
                if (email) user.email = email;
                if (school) user.school = school;
                if (program) user.program = program;
                if (year) user.year = year;

                await user.save();
                res.status(200).json({ message: "User successfully updated !" });
                return;
            } else {
                res.status(404).json({ error: "User not found." });
                return;
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occured while modifying the user." });
            return;
        }
    }
);

export default router;