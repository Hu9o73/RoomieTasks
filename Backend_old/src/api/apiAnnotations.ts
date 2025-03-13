// Liveness
/**
 * @openapi
 * /api/liveness:
 *   get:
 *     summary: Check if the server is alive
 *     description: This endpoint checks if the API is alive and responsive.
 *     tags:
 *      - Utility
 *     responses:
 *       200:
 *         description: A message indicating that the API is alive.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: "API is alive."
 */


/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Access a protected route.
 *     description: This endpoint requires a valid JWT token to access. The token should be included in the Authorization header as a Bearer token.
 *     tags:
 *       - Utility
 *     security:
 *       - bearerAuth: [] # Indicates this route is secured with JWT
 *     responses:
 *       200:
 *         description: Successfully accessed the protected route.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This is a protected route"
 *                 user:
 *                   type: object
 *                   description: Information about the authenticated user.
 *                   properties:
 *                     userId:
 *                       type: number
 *                       example: 1
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token provided."
 *       403:
 *         description: Forbidden. The user does not have the required permissions.
 */


/**
 * @swagger
 * /user/{userId}/firstName:
 *   get:
 *     summary: Get the first name of a user by their ID.
 *     description: Fetches the first name of the user with the specified user ID from the database.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose first name is being requested.
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's first name.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   example: "John"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */




/**
 * @swagger
 * /whoAmI:
 *   get:
 *     summary: Retrieve the details of the authenticated user.
 *     description: This endpoint provides detailed information about the authenticated user. A valid JWT token is required to access this route.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: [] # Indicates this route is secured with JWT
 *     responses:
 *       200:
 *         description: Successfully retrieved the user's details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: number
 *                   example: 1
 *                 userNickname:
 *                   type: string
 *                   example: "cool_user123"
 *                 userFirstName:
 *                   type: string
 *                   example: "John"
 *                 userLastName:
 *                   type: string
 *                   example: "Doe"
 *                 userEmail:
 *                   type: string
 *                   example: "johndoe@example.com"
 *                 userSchool:
 *                   type: string
 *                   example: "ESILV"
 *                 userYear:
 *                   type: string
 *                   example: "A4"
 *                 userProgram:
 *                   type: string
 *                   example: "Classic"
 *                 userRole:
 *                   type: string
 *                   example: "Member"
 *       400:
 *         description: Invalid user ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid userId"
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token provided."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error when fetching whoAmI."
 */




/**
 * @swagger
 * /verifyPwd:
 *   post:
 *     summary: Verify the password of the authenticated user.
 *     description: This endpoint allows the authenticated user to verify their password by comparing it with the stored hashed password. A valid JWT token is required to access this route.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: [] # Indicates this route is secured with JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "your_password_here"
 *                 description: The plain-text password to be verified.
 *     responses:
 *       200:
 *         description: Password verification result.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 validPass:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Passwords do match !"
 *       404:
 *         description: User or UserId not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found."
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token provided."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while modifying the user."
 */





/**
 * @swagger
 * /modifyMe:
 *   put:
 *     summary: Modify the authenticated user's details.
 *     description: Allows the authenticated user to update their profile information. A valid JWT token is required to access this route.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: [] # Indicates this route is secured with JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: The new nickname of the user.
 *                 example: "new_nickname123"
 *               email:
 *                 type: string
 *                 description: The new email address of the user.
 *                 example: "newemail@example.com"
 *               school:
 *                 type: string
 *                 description: The updated school of the user.
 *                 example: "Stanford University"
 *               program:
 *                 type: string
 *                 description: The updated program of the user.
 *                 example: "Data Science"
 *               year:
 *                 type: string
 *                 description: The updated academic year of the user.
 *                 example: "Senior"
 *     responses:
 *       200:
 *         description: User successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User successfully updated!"
 *       404:
 *         description: User not found or UserId not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "UserId not found."
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token provided."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while modifying the user."
 */


/**
 * @swagger
 * /modifyRole:
 *   put:
 *     summary: Modify the role of a user.
 *     description: This endpoint allows users with the "President" or "Admin" role to modify the role of another user. The user ID and new role must be provided in the request body.
 *     tags:
 *       - Administration
 *     security:
 *       - bearerAuth: [] # Indicates this route is secured with JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToUpdate:
 *                 type: number
 *                 example: 2
 *                 description: The ID of the user whose role is to be modified.
 *               roleToUpdate:
 *                 type: string
 *                 example: "Admin"
 *                 description: The new role to assign to the user.
 *     responses:
 *       200:
 *         description: Successfully updated the user's role.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User johndoe@example.com with id 2 successfully updated to have role: Admin"
 *       400:
 *         description: Missing required parameters (id or role).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Id and Role are required !"
 *       404:
 *         description: User to update not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User to update not found !"
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No token provided."
 *       403:
 *         description: Forbidden. User does not have sufficient role permissions.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Access denied. Insufficient permissions."
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An error occurred while updating the role."
 */



/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Register a new user.
 *     description: This endpoint allows a user to sign up by providing their details. It checks if the user already exists, hashes the password, and then creates a new user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *                 description: The user's first name.
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *                 description: The user's last name.
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 example: "password123"
 *                 description: The user's password.
 *               confirmPassword:
 *                 type: string
 *                 example: "password123"
 *                 description: The user's password confirmation.
 *               year:
 *                 type: string
 *                 example: "2024"
 *                 description: The user's year of study.
 *               program:
 *                 type: string
 *                 example: "Computer Science"
 *                 description: The user's program of study.
 *               school:
 *                 type: string
 *                 example: "University of Example"
 *                 description: The school the user is attending.
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 user:
 *                   type: number
 *                   example: 1
 *       400:
 *         description: User already exists or invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already exists"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating user"
 */




/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in a user.
 *     description: This endpoint allows a user to log in by providing their email and password. It validates the credentials and returns a JWT token on successful login.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 example: "password123"
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token and user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MX0.VrLsXk..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     role:
 *                       type: string
 *                       example: "User"
 *       400:
 *         description: Invalid credentials or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error logging in"
 */



/**
 * @swagger
 * /users:
 *   get:
 *     summary: Fetch a list of users.
 *     description: This endpoint retrieves a list of users from the database, including their `id`, `firstName`, and `lastName`. If no users are found, a 404 error is returned.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: A list of users with their `id`, `firstName`, and `lastName`.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                     description: The user's unique identifier.
 *                   firstName:
 *                     type: string
 *                     example: "John"
 *                     description: The user's first name.
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                     description: The user's last name.
 *       404:
 *         description: No users found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No users found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Server error"
 *                 error:
 *                   type: object
 *                   description: The error details.
 */

