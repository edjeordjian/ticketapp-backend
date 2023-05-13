const rewire = require("rewire");

const { getBcryptOf, getHashOf, replaceAll, fullTrimString, replaceAllBy, setCharAt } = rewire("../../../src/helpers/StringHelper");

const assert = require("assert");


describe("code functions", () => {
    describe("getBcryptOf", () => {
      it("should return a string", () => {
        const result = getBcryptOf("test");
        assert.strictEqual(typeof result, "string");
      });
    });
  
    describe("getHashOf", () => {
      it("should return a string", () => {
        const result = getHashOf("test");
        assert.strictEqual(typeof result, "string");
      });
  
      it("should return a hash with 10 characters after .p5.", () => {
        const result = getHashOf("test.p5.");
        assert.strictEqual(result.length, 10);
      });
    });
  
    describe("replaceAll", () => {
      it("should replace all instances of a string in a string", () => {
        const result = replaceAll("test", "t", "b");
        assert.strictEqual(result, "besb");
      });
    });
  
    describe("fullTrimString", () => {
      it("should return a trimmed string with no accented characters", () => {
        const result = fullTrimString("  áéíóú  ");
        assert.strictEqual(result, "  aeiou  ");
      });
    });
  
    describe("replaceAllBy", () => {
      it("should replace all instances of multiple strings in a string", () => {
        const result = replaceAllBy("test", { "t": "b", "e": "a" });
        assert.strictEqual(result, "basb");
      });
    });
  
    describe("setCharAt", () => {
      it("should replace a character at a specific index in a string", () => {
        const result = setCharAt("test", 2, "b");
        assert.strictEqual(result, "tebt");
      });
    });
  });