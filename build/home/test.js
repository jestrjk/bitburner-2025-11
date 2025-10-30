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
var ServerList = class {
  constructor(ns) {
    this.ns = ns;
    this.buildAllServers();
    this.buildScriptHosts();
    this.getUtilityHosts();
  }
  ns;
  all_servers = [];
  script_hosts = [];
  utility_hosts = [];
  buildAllServers() {
    this.recursiveServerScan("home");
  }
  getUtilityHosts() {
    this.utility_hosts = this.all_servers.filter((s) => s.purchasedByPlayer && s.hostname.startsWith("utility-"));
  }
  buildScriptHosts() {
    this.script_hosts = this.all_servers.filter((s) => s.purchasedByPlayer);
  }
  recursiveServerScan(parent_host_name = "home") {
    let new_server_names = this.ns.scan(parent_host_name);
    for (let new_server_name of new_server_names) {
      if (this.all_servers.filter((s) => s.hostname == new_server_name).length > 0) {
        continue;
      } else {
        this.all_servers.push(this.ns.getServer(new_server_name));
        this.recursiveServerScan(new_server_name);
      }
    }
  }
};

// servers/home/test.tsx
function MyComponent() {
  const [count, setCount] = (0, import_react.useState)(0);
  return /* @__PURE__ */ import_react.default.createElement("div", null, "Count ", count, " ", /* @__PURE__ */ import_react.default.createElement("button", { onClick: () => setCount(count + 1) }, "Add to count"));
}
function ServerBrowser({ ns }) {
  const [serverList, setServerList] = (0, import_react.useState)(new ServerList(ns));
  setInterval(() => {
    setServerList(new ServerList(ns));
  }, 1e3);
  return /* @__PURE__ */ import_react.default.createElement("table", null, /* @__PURE__ */ import_react.default.createElement("thead", null, /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("td", null, "Hostname"), /* @__PURE__ */ import_react.default.createElement("td", null, "Max$"), /* @__PURE__ */ import_react.default.createElement("td", null, "$"))), /* @__PURE__ */ import_react.default.createElement("tbody", null, serverList.all_servers.map(
    (server) => /* @__PURE__ */ import_react.default.createElement("tr", null, /* @__PURE__ */ import_react.default.createElement("td", null, server.hostname), /* @__PURE__ */ import_react.default.createElement("td", null, server.moneyMax), /* @__PURE__ */ import_react.default.createElement("td", null, server.moneyAvailable))
  )));
}
async function main(ns) {
  ns.ui.openTail();
  ns.disableLog("scan");
  ns.printRaw(/* @__PURE__ */ import_react.default.createElement(MyComponent, null));
  ns.printRaw(/* @__PURE__ */ import_react.default.createElement(ServerBrowser, { ns }));
}
export {
  MyComponent,
  ServerBrowser,
  main
};
