import React, { useState, useEffect } from 'react';

const MyCustomUI = ({ ns }) => {
  const [money, setMoney] = useState(null);
  const targetServer = 'n00dles'; // Example server

  useEffect(() => {
    const fetchData = async () => {
      // Use "await" before any asynchronous Netscript function call
      await ns.sleep(100); // Wait briefly to avoid freezing the game on first run
      const serverMoney = ns.getServerMoneyAvailable(targetServer);
      
      // ns.getServerMoneyAvailable() is synchronous, but functions like
      // ns.hack(), ns.grow(), ns.weaken(), ns.sleep() are async and require "await"

      setMoney(serverMoney);
    };

    fetchData();
  }, [ns, targetServer]); // Dependencies array

  // Example of an event handler with an async call
  const handleHack = async () => {
    await ns.hack(targetServer); // Requires "await"
    // After hacking, you might want to re-fetch data to update the UI
    const updatedMoney = ns.getServerMoneyAvailable(targetServer);
    setMoney(updatedMoney);
  };

  return (
    <div>
      <p>Money available on {targetServer}: {money}</p>
      <button onClick={handleHack}>Hack Server</button>
    </div>
  );
};

export default MyCustomUI;
