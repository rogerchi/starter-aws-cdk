import type { DataLoader } from "@remix-run/core";
import { json } from "@remix-run/data";

export let loader: DataLoader = async () => {
  return json(
    {
      message: "this is awesome 😎",
    },
    {
      headers: {
        "cache-control": "s-maxage=5",
      },
    }
  );
};
