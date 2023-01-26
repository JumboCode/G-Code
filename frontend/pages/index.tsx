import React from "react";

interface Props {
  window?: () => Window;
}

export default function Home(props: Props) {
  return (
    <>
      <a href="./Dashboard"> go to dashboard </a>
    </>
  );
}
