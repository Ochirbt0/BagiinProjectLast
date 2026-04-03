import "dotenv/config";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function test() {
  try {
    console.log("KEY:", process.env.OPENAI_API_KEY); // шалгах

    const res = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: "Сайн уу",
    });

    console.log(res.output_text);
  } catch (err) {
    console.error("ERROR:", err);
  }
}

test();
