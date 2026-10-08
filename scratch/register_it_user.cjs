async function registerUser() {
  const url = 'http://127.0.0.1:8000/api/auth/register';
  const data = {
    email: 'resp.infrastructure@azpulse.local',
    firstName: 'Responsable',
    lastName: 'Infrastructure',
    requestedDomain: 'Infrastructure & IT',
    motivation: 'Je suis le nouveau responsable du module Infrastructure & IT.',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Error:', error);
  }
}

registerUser();
