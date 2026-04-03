import "dotenv/config";
import OpenAI from "openai";

console.log("SCRIPT STARTED");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    console.log("CALLING API...");

    const res = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "Сайн уу",
    });

    console.log("RESULT:");
    console.log(res.output_text);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

test();
