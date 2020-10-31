import { objectType } from "@nexus/schema";

export const AuthPayload = objectType({
    name: "AuthPayload",
    definition(t) {
        t.string("token"), 
        t.field("user", { type: "User" });
    }
});

/**
 * pleaseEnterSomethingHere
 */
enterSomethingHere = (name: string) => {
    console.log("Entersomething");
    
}
