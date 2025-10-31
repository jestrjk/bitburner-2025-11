// servers/home/server_information/ServerInformationList.ts
async function writeServerList(ns, data) {
  await ns.writePort(1 /* SERVER_LIST */, JSON.stringify(data));
}
async function readServerList(ns) {
  return JSON.parse(await ns.peek(1 /* SERVER_LIST */));
}
function recursiveServerScan(ns, parent_host_name, newServerInformationList) {
  let new_server_names = ns.scan(parent_host_name);
  for (let new_server_name of new_server_names) {
    if (newServerInformationList.find((s) => s.hostname == new_server_name)) {
      continue;
    } else {
      newServerInformationList.push(ns.getServer(new_server_name));
      recursiveServerScan(ns, new_server_name, newServerInformationList);
    }
  }
}
async function main(ns) {
  ns.tprint(`Starting script at ${Date.now()}`);
  ns.ui.openTail();
  ns.disableLog("scan");
  ns.print(`Starting server scan at ${Date.now()}`);
  while (true) {
    ns.clearLog();
    const new_server_list = [];
    recursiveServerScan(ns, "home", new_server_list);
    await writeServerList(ns, new_server_list);
    ns.print(`Scanned ${new_server_list.length} servers`);
    ns.print(`Last updated: ${Date.now()}`);
    await ns.sleep(1e3);
  }
}
export {
  main,
  readServerList
};
