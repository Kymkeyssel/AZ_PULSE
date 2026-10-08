const https = require('https');

async function getGLPICount() {
  const url = 'https://azcorporationit.fr33.glpi-network.cloud/apirest.php';
  const appToken = 'J54lOIt4Ks2n0yTBGiW68wB5XnBLXbLWDEw7vjHu';
  const userToken = 'CKFFQtqWMvGKHHHkX5SLGCQV5HgynhbPM2AqprMI';

  const initResponse = await fetch(`${url}/initSession`, {
    headers: {
      'App-Token': appToken,
      'Authorization': `user_token ${userToken}`
    }
  });
  
  if (!initResponse.ok) {
    console.error('Init failed', await initResponse.text());
    return;
  }
  
  const initData = await initResponse.json();
  const sessionToken = initData.session_token;

  const compResponse = await fetch(`${url}/Computer?expand_dropdowns=true`, {
    headers: {
      'App-Token': appToken,
      'Session-Token': sessionToken
    }
  });
  
  const compData = await compResponse.json();
  console.log(`Nombre d'équipements : ${compData.length}`);
  compData.forEach(comp => {
    console.log(`- ${comp.name || 'Nom inconnu'} (ID: ${comp.id})`);
  });
  
  await fetch(`${url}/killSession`, {
    headers: {
      'App-Token': appToken,
      'Session-Token': sessionToken
    }
  });
}

getGLPICount().catch(console.error);
