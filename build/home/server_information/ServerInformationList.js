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
export {
  ServerList
};
