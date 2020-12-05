import React from "react";
import { useRouteData } from "@remix-run/react";

interface MetaArg {
  data: Record<string, any>;
  parentsData: Record<string, any>;
  params: Record<string, any>;
  location: {
    pathname: string;
    search: string;
    hash: string;
    state: null | any;
    key: string;
  };
}

export function meta({ data }: MetaArg) {
  return {
    title: !data.name ? "Hello!" : `Welcome back ${data.name}!`,
    description: "Welcome to remix!",
  };
}

export default function Index() {
  let data = useRouteData();

  return (
    <div style={{ padding: 20 }}>
      {!data.name && (
        <form method="post" action="/hello">
          <p>
            <label>
              Name: <input name="name" type="text" />
            </label>
          </p>
          <button>Log in</button>
        </form>
      )}
      {data.name && (
        <>
          <p>Hello {data.name}</p>
          <form method="post" action="/hello">
            <button>Log Out</button>
          </form>
        </>
      )}
    </div>
  );
}
