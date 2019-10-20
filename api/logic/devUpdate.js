const getDevMsg = (dataCount, stopCount, usingInbounds, inboundsSent) => {
  return `# of Users: ${dataCount}\n# of STOPS: ${stopCount}\n# of Users using inbounds: ${usingInbounds}\n# of inbounds sent: ${inboundsSent}\nCost of inbounds: $${parseFloat(
    inboundsSent * 0.01
  ).toFixed(2)}\n\nEst. Monthly Cost: $${calculateCost(
    dataCount,
    stopCount
  )}\nEst. Yearly Cost: $${calculateCost(dataCount, stopCount) * 12}`;
};

const calculateCost = (dataCount, stopCount) => {
  const toSend = (dataCount - stopCount) * 0.25;
  const totalSMSCost = toSend * (365 / 12) * 0.006;
  return parseFloat(totalSMSCost + 8).toFixed(2);
};

module.exports = dbUsers => {
  const users = Object.keys(dbUsers).map(user => dbUsers[user]);
  const usingInbounds = users.filter(user => user.hasOwnProperty("inbounds"));
  const inboundsSent = usingInbounds.reduce((a, c) => a + c.inbounds.length, 0);
  const stops = users.filter(user => user.repliedStop);
  return getDevMsg(
    users.length,
    stops.length,
    usingInbounds.length,
    inboundsSent
  );
};
