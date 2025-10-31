var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// react:react
var require_react = __commonJS({
  "react:react"(exports, module) {
    module.exports = React;
  }
});

// servers/home/test.tsx
var import_react = __toESM(require_react());

// servers/home/server_information/ServerInformationList.ts
async function readServerList(ns) {
  return JSON.parse(await ns.peek(1 /* SERVER_LIST */));
}

// servers/home/test.tsx
function ServerBrowser({ ns }) {
  const [serverList, setServerList] = (0, import_react.useState)([]);
  const [lastUpdated, setLastUpdated] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    let intervalId = 0;
    const fetchServers = async () => {
      setServerList(await readServerList(ns));
      setLastUpdated(Date.now());
    };
    fetchServers();
    intervalId = setInterval(fetchServers, 2e3);
    return () => clearInterval(intervalId);
  }, [ns]);
  return /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("table", null, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("td", null, "Hostname"), /* @__PURE__ */ import_react.default.createElement("td", null, "Max$"), /* @__PURE__ */ import_react.default.createElement("td", null, "$"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, serverList.map(
    (server) => /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("td", null, server.hostname), /* @__PURE__ */ import_react.default.createElement("td", null, server.moneyMax), /* @__PURE__ */ import_react.default.createElement("td", null, server.moneyAvailable))
  ))), /* @__PURE__ */ import_react.default.createElement("div", null, "Updated: ", lastUpdated));
}
async function main(ns) {
  ns.ui.openTail();
  ns.disableLog("scan");
  ns.printRaw(/* @__PURE__ */ import_react.default.createElement(ServerBrowser, { ns }));
  return new Promise(() => {
  });
}
export {
  ServerBrowser,
  main
};
