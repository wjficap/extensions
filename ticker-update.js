const Crypto_refer = 'https://crypto.com/app/uu8m79wf45';

function onAlarm() {
  updateTicker();
}

function onInit() {
  updateTicker();
  chrome.alarms.create('btc-ticker-watchdog', {periodInMinutes: 1});

  chrome.contextMenus.create({
    id: "CDC_id",
    title: "Support my Work!",
    contexts: ['browser_action']
  });

 chrome.contextMenus.onClicked.addListener((info)=>{
    let navLink = null;

    if (info.menuItemId == "CDC_id") {
      navLink = Crypto_refer;
      chrome.tabs.create({url: navLink});
    }
  
  });
}

async function updateTicker() {
  [priceResp] = await Promise.all([
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Ccrypto-com-chain%2Cpolkadot%2Cmatic-network&vs_currencies=usd%2Csgd', {cache: "no-store"}),
      // fetch('https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday', {cache: "no-store"})
    ]);
  const tickerData = await priceResp.json();

  const rateCrypto1 = (tickerData['bitcoin'].usd);
  const rateCrypto2 = tickerData['crypto-com-chain'].usd;
  const rateCrypto3 = tickerData['polkadot'].usd;
  const rateCrypto4 = tickerData['matic-network'].usd;
  

  const print_rateCrypto1 = (rateCrypto1/1000).toFixed(2);

  const title = `BTC: $${rateCrypto1} \nCRO: $${rateCrypto2} \nPolkadot: $${rateCrypto3}\nPolygon: $${rateCrypto4}`;

  chrome.browserAction.setBadgeText({text: print_rateCrypto1});
  chrome.browserAction.setBadgeBackgroundColor({color: '#00008B'});
  chrome.browserAction.setTitle({title: title});
}

function navigateAway() {
  const navLink = 'https://www.coindesk.com/price/bitcoin';
  chrome.tabs.create({url: navLink});
}

chrome.runtime.onInstalled.addListener(onInit);
chrome.alarms.onAlarm.addListener(onAlarm);
chrome.browserAction.onClicked.addListener(navigateAway);