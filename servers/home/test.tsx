import {NS} from "NetscriptDefinitions";
import React, {useState} from 'react';

export function MyComponent(){
  const [count, setCount] = useState(0);

  return <div>Count {count} <button onClick={() => setCount(count + 1)}>Add to count</button></div>;
}

export async function main(ns: NS) {
  ns.ui.openTail();
  ns.tprint("Hello World");

  ns.printRaw(<MyComponent />);
}