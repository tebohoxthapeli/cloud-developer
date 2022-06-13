import { Router, Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { NextFunction } from "connect";
import { validate } from "email-validator";

import { User } from "../models/User";
import { config } from "../../../../config/config";

const router = Router();
const secret = config.jwt.secret;

interface ReqAuth extends Request {
    user?: string | JwtPayload;
}

async function generatePasswordHash(plainTextPassword: string): Promise<string> {
    //@TODO Use Bcrypt to Generated Salted Hashed Passwords

    try {
        return await hash(plainTextPassword, 10);
    } catch (error) {
        console.error(error);
    }
}

async function comparePasswords(plainTextPassword: string, hash: string): Promise<boolean> {
    //@TODO Use Bcrypt to Compare your password to your Salted Hashed Password

    try {
        return await compare(plainTextPassword, hash);
    } catch (error) {
        console.error(error);
    }
}

function generateJWT(user: User): string {
    //@TODO Use jwt to create a new JWT Payload containing
    return sign(user.toJSON(), secret);
}

export function requireAuth(req: ReqAuth, res: Response, next: NextFunction) {
    if (!req.headers || !req.headers.authorization) {
        return res.status(401).json({ message: "No authorization headers." });
    }

    const token_bearer = req.headers.authorization.split(" ");

    if (token_bearer.length != 2) {
        return res.status(401).json({ message: "Malformed token." });
    }

    const token = token_bearer[1];

    verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(500).json({ auth: false, message: "Failed to authenticate." });
        }

        req.user = decoded;
        next();
    });
}

router.get("/verification", requireAuth, async (_, res: Response) => {
    return res.status(200).send({ auth: true, message: "Authenticated." });
});

router.post("/login", async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;

    // check email is valid
    if (!email || !validate(email)) {
        return res.status(400).json({ auth: false, message: "Email is required or malformed" });
    }

    // check email password valid
    if (!password) {
        return res.status(400).json({ auth: false, message: "Password is required" });
    }

    const user = await User.findByPk(email);

    // check that user exists
    if (!user) {
        return res.status(401).json({ auth: false, message: "Unauthorized" });
    }

    // check that the password matches
    const authValid = await comparePasswords(password, user.passwordHash);

    if (!authValid) {
        return res.status(401).json({ auth: false, message: "Unauthorized" });
    }

    // Generate JWT
    const jwt = generateJWT(user);

    res.status(200).json({ auth: true, token: jwt, user: user.short() });
});

//register a new user
router.post("/", async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;

    // check email is valid
    if (!email || !validate(email)) {
        return res.status(400).json({ auth: false, message: "Email is required or malformed" });
    }

    // check email password valid
    if (!password) {
        return res.status(400).json({ auth: false, message: "Password is required" });
    }

    // find the user
    const user = await User.findByPk(email);

    // check that user doesnt exists
    if (user) {
        return res.status(422).json({ auth: false, message: "User may already exist" });
    }

    const passwordHash = await generatePasswordHash(password);

    const newUser = new User({
        email,
        passwordHash,
    });

    let savedUser: User;

    try {
        savedUser = await newUser.save();
    } catch (error) {
        throw error;
    }

    // Generate JWT
    const jwt = generateJWT(savedUser);

    res.status(201).json({ token: jwt, user: savedUser.short() });
});

export { router as AuthRouter };
