// Import  "Supertest"
const request = require('supertest');
// Import de l' app
const app = require('../app');

//test unitaire avec Jest pour tester la route POST users/signin
it('POST users/signin avec mail et password corrects', async () => 
{
    // Envoie d' une requête POST  avec des données d'identification existatnt dans la DB
    const res = await request(app).post('/api/users/signin').send({
    email: 'john@mail.com',  // Cet email doit exister dans la base
    password: 'Azerty123?', //  mot de passe correct
    });

    // Vérifie que la réponse a un code HTTP 200 (succès)
    expect(res.statusCode).toBe(200);

    // Vérifie que la propriété "result" est bien "true" dans la réponse
    expect(res.body.result).toBe(true);

    // Vérifie que la propriété "sport" est un tableau
    expect(Array.isArray(res.body.sport)).toBe(true);

    // Vérifie que la propriété "token" est une chaîne de 32 caractères
    expect(res.body.token).toHaveLength(32);
});


// Test du cas où l'utilisateur n'existe pas ou le mot de passe est incorrect
it('POST users/signin avec un mauvais mot de passe retourne une erreur', async () => 
{
  // Envoie une requête POST avec un email valide mais un mauvais mot de passe
  const res = await request(app).post('/api/users/signin').send({
    email: 'john@mail.com', // Cet email doit exister dans la base
    password: 'MauvaisMotDePasse123', // Mauvais mot de passe
  });

  // Vérifie que le code HTTP est bien 200 
  expect(res.statusCode).toBe(200);

  // Vérifie que le champ "result" est false
  expect(res.body.result).toBe(false);

  // Vérifie que le champ "error" correspond au message attendu
  expect(res.body.error).toBe('User not found or wrong password');
});

