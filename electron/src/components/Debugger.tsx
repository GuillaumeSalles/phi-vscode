import React, { useState } from "react";

export default function Debugger() {
  const [variable, setVariable] = useState("");
  return (
    <div>
      <input onChange={e => setVariable(e.target.value)}></input>
      <button
        onClick={() => {
          console.log(
            variable,
            getComputedStyle(document.documentElement).getPropertyValue(
              variable
            )
          );
        }}
      >
        Test
      </button>
    </div>
  );
}
