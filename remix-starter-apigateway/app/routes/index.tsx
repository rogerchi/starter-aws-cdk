import React from "react";
import { useRouteData } from "@remix-run/react";

export function meta() {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!",
  };
}

export function headers({ loaderHeaders }: { loaderHeaders: Headers }) {
  return {
    "cache-control": loaderHeaders.get("cache-control"),
  };
}

export default function Index() {
  let data = useRouteData();

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome to Remix!</h2>
      <p>
        <a href="https://remix.run/dashboard/docs">Check out the docs</a> to get
        started.
      </p>
      <p>
        Pages:
        <ul>
          <li>
            <a href="/hello">Test sessions</a>
          </li>
        </ul>
      </p>
      <p>Message from the loader: {data.message}</p>
    </div>
  );
}
