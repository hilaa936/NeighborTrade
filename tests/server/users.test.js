import { beforeEach, describe, expect, it } from "vitest";
import { getPublicProfile, registerUser, updateProfile, verifyCredentials } from "@/server/users";
import { makeUser, resetDb } from "./helpers";

beforeEach(resetDb);

describe("registration and login", () => {
  it("registers a user and accepts only the right password", async () => {
    await registerUser({ name: "דנה", email: "Dana@Example.com", password: "longpassword" });
    expect(await verifyCredentials("dana@example.com", "longpassword")).toMatchObject({ name: "דנה" });
    expect(await verifyCredentials("dana@example.com", "wrong-password")).toBeNull();
    expect(await verifyCredentials("nobody@example.com", "longpassword")).toBeNull();
  });

  it("never returns the password hash", async () => {
    const user = await registerUser({ name: "דנה", email: "d@example.com", password: "longpassword" });
    expect(user).not.toHaveProperty("passwordHash");
  });

  it("rejects short passwords and duplicate emails", async () => {
    await expect(registerUser({ name: "דנה", email: "d@example.com", password: "short" })).rejects.toThrow();
    await registerUser({ name: "דנה", email: "d@example.com", password: "longpassword" });
    await expect(
      registerUser({ name: "דני", email: "D@example.com", password: "longpassword" })
    ).rejects.toMatchObject({ code: "email_taken" });
  });
});

describe("profile", () => {
  it("rounds a shared location and ignores unknown fields", async () => {
    const user = await makeUser({ localityId: null });
    const updated = await updateProfile(user.id, {
      name: "נועה",
      lat: 32.08531,
      lng: 34.78179,
      role: "ADMIN",
      email: "evil@example.com",
    });
    expect(updated).toMatchObject({ lat: 32.09, lng: 34.78, localityId: "tel-aviv", email: user.email });
  });

  it("public profile has no email or exact data beyond what we allow", async () => {
    const user = await makeUser();
    const profile = await getPublicProfile(user.id);
    expect(profile).not.toHaveProperty("email");
    expect(profile).not.toHaveProperty("passwordHash");
  });
});
