import { intArg, makeSchema, objectType, stringArg } from "@nexus/schema";
import { nexusPrismaPlugin } from "nexus-prisma";

const User = objectType({
    name: "User",
    definition(t) {
        t.model.id();
        t.model.name();
        t.model.email();
    }
});

const Mutation = objectType({
    name: "Mutation",
    definition(t) {
        t.crud.createOneUser({ alias: "signupUser" });
    }
});

export const schema = makeSchema({
    types: [Mutation, User],
    plugins: [nexusPrismaPlugin()],
    outputs: {
        schema: __dirname + "/../schema.graphql",
        typegen: __dirname + "/generated/nexus.ts"
    },
    typegenAutoConfig: {
        contextType: "Context.Context",
        sources: [
            {
                source: "@prisma/client",
                alias: "prisma"
            },
            {
                source: require.resolve("./context"),
                alias: "Context"
            }
        ]
    }
});