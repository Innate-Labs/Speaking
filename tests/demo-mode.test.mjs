import assert from "node:assert/strict";
import test from "node:test";
import * as demoMode from "../src/lib/demo-mode.ts";

const { clearSpeakCoachStorage, createMemoryStorage, isDemoMode } = demoMode;

test("isDemoMode only enables the exact true value", () => {
  assert.equal(isDemoMode("true"), true);
  assert.equal(isDemoMode("false"), false);
  assert.equal(isDemoMode(undefined), false);
});

test("memory storage survives reads until it is cleared", () => {
  const storage = createMemoryStorage();
  storage.setItem("speakcoach_records", "one");
  assert.equal(storage.getItem("speakcoach_records"), "one");
  storage.clear();
  assert.equal(storage.getItem("speakcoach_records"), null);
});

test("cleanup removes only SpeakCoach keys", () => {
  const storage = createMemoryStorage();
  storage.setItem("speakcoach_user", "user");
  storage.setItem("speakcoach_file_1", "file");
  storage.setItem("other_app", "keep");

  assert.equal(clearSpeakCoachStorage(storage), 2);
  assert.equal(storage.getItem("speakcoach_user"), null);
  assert.equal(storage.getItem("speakcoach_file_1"), null);
  assert.equal(storage.getItem("other_app"), "keep");
});

test("demo mode redirects only the login page", () => {
  assert.equal(typeof demoMode.getDemoRedirectPath, "function");
  assert.equal(demoMode.getDemoRedirectPath("/login", true), "/");
  assert.equal(demoMode.getDemoRedirectPath("/records", true), null);
  assert.equal(demoMode.getDemoRedirectPath("/login", false), null);
});
