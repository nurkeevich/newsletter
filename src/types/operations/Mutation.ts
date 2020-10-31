import { objectType, stringArg } from "@nexus/schema";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export const Mutation = objectType({
    name: "Mutation",
    definition(t) {
        t.field("SignUp", {
            type: "AuthPayload",
            description: "Sign up user",
            args: {
                email: stringArg({ nullable: false }),
                password: stringArg({ nullable: false }),
                name: stringArg()
            },
            resolve: async (parent, args, context) => {
                const emailTaken = await context.prisma.user.findOne({
                    where: { email: args.email }
                });
                if (emailTaken) {
                    throw new Error(`${args.email}: already taken`);
                }

                const password = await bcrypt.hash(args.password, 10);
                const user = await context.prisma.user.create({
                    data: { ...args, password }
                });

                return {
                    token: jwt.sign(
                        { userId: user.id },
                        process.env.APP_SECRET as string
                    ),
                    user
                };
            }
        });

        t.field("SignIn", {
            type: "AuthPayload",
            description: "Sign in user",
            args: {
                email: stringArg({ nullable: false }),
                password: stringArg({ nullable: false })
            },
            resolve: async (parent, { email, password }, { prisma }) => {
                const user = await prisma.user.findOne({ where: { email } });
                if (!user) {
                    throw new Error(`No such user found for email: ${email}`);
                }

                const validPassword = await bcrypt.compare(
                    password,
                    user.password
                );
                if (!validPassword) {
                    throw new Error("Invalid password");
                }

                return {
                    token: jwt.sign(
                        { userId: user.id },
                        process.env.APP_SECRET as string
                    ),
                    user
                };
            }
        });
    }
});
