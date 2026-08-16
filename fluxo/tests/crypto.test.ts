import { describe, it, expect } from "vitest";
import { verifyPassword, randomHex, sha256Hex } from "../functions/_lib/crypto";
import { pbkdf2Sync, randomBytes } from "node:crypto";

// Gera um hash "do jeito que o Node faria" pra confirmar que bate com o que o
// runtime de Workers calcula via Web Crypto — é exatamente o bug que corrigi
// de verdade no seed (salt tratado como string em vez de bytes hex).
function hashLikeNode(password: string, saltHex: string) {
  const salt = Buffer.from(saltHex, "hex");
  return pbkdf2Sync(password, salt, 100_000, 32, "sha256").toString("hex");
}

describe("verifyPassword", () => {
  it("aceita a senha certa", async () => {
    const salt = randomBytes(16).toString("hex");
    const hash = hashLikeNode("Prumo@123", salt);
    await expect(verifyPassword("Prumo@123", salt, hash)).resolves.toBe(true);
  });

  it("rejeita a senha errada", async () => {
    const salt = randomBytes(16).toString("hex");
    const hash = hashLikeNode("Prumo@123", salt);
    await expect(verifyPassword("senha-errada", salt, hash)).resolves.toBe(false);
  });

  it("é sensível a maiúsculas/minúsculas", async () => {
    const salt = randomBytes(16).toString("hex");
    const hash = hashLikeNode("Prumo@123", salt);
    await expect(verifyPassword("prumo@123", salt, hash)).resolves.toBe(false);
  });

  it("dois salts diferentes produzem hashes diferentes pra mesma senha", () => {
    const saltA = randomBytes(16).toString("hex");
    const saltB = randomBytes(16).toString("hex");
    expect(hashLikeNode("mesma-senha", saltA)).not.toBe(hashLikeNode("mesma-senha", saltB));
  });
});

describe("randomHex", () => {
  it("gera hex do tamanho certo e nunca repete", () => {
    const a = randomHex(32);
    const b = randomHex(32);
    expect(a).toHaveLength(64);
    expect(a).not.toBe(b);
    expect(a).toMatch(/^[0-9a-f]+$/);
  });
});

describe("sha256Hex", () => {
  it("é determinístico — mesma entrada, mesmo hash", async () => {
    const a = await sha256Hex("um-token-qualquer");
    const b = await sha256Hex("um-token-qualquer");
    expect(a).toBe(b);
    expect(a).toHaveLength(64);
  });
});
