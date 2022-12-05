import type { APIRoute } from "astro";
import { songs } from "../../../data/songs.json";

export const get: APIRoute = () => {
  return {
    body: JSON.stringify({
      songs: songs,
    }),
  };
};
