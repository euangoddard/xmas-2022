import type { APIRoute } from "astro";
import { Configuration, OpenAIApi } from "openai";

export const post: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { phrase } = body;
  try {
    const song = await getOpenAIResponse(phrase);
    return {
      body: JSON.stringify({
        phrase,
        song,
      }),
    };
  } catch (e: any) {
    return {
      body: e.message,
      status: 500,
    };
  }
};

const getOpenAIResponse = async (phrase: string) => {
  const configuration = new Configuration({
    apiKey: import.meta.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const prompt = `Write a Christmas song about ${phrase.trim()}`;
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 512,
    });
    const topChoice = response.data.choices[0];
    return topChoice?.text?.trim();
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
      throw new OpenAIError(`${error.response.status}: ${error.response.data}`);
    } else {
      console.log(error.message);
      throw new OpenAIError(error.message);
    }
  }
};

class OpenAIError extends Error {}
