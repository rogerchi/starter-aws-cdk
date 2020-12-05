import type { DataLoader } from "@remix-run/core";
import { Action, parseFormBody, redirect } from "@remix-run/data";

import { json } from "@remix-run/data";

export let loader: DataLoader = async ({ session }) => {
  return json({
    name: session.get("name"),
  });
};

export let action: Action = async ({ request, session }) => {
  let userInfo = await parseFormBody(request);

  session.set("name", userInfo.get("name") as string);

  return redirect(`/hello`);
};
