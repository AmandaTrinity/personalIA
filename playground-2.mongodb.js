/* global use, db */
// MongoDB Playground
// To disable this template go to Settings | MongoDB | Use Default Template For Playground.
// Make sure you are connected to enable completions and to be able to run a playground.
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.
// The result of the last command run in a playground is shown on the results panel.
// By default the first 20 documents will be returned with a cursor.
// Use 'console.log()' to print to the debug output.
// For more documentation on playgrounds please refer to
// https://www.mongodb.com/docs/mongodb-vscode/playgrounds/
use('personalai_db');
db.getCollection('treinos').insertOne({
  usuario_id: ObjectId("64f7a2c9e4b0a5d6f8c9e123"), // Replace with the actual user ID
  nivel: "Intermediário",
  objetivo: "Ganhar massa muscular",
  equipamentos: ["Halteres", "Barra fixa"],
  frequencia: "3 vezes por semana",
  mensagem_usuario: "Quero um treino focado em hipertrofia.",
  plano_gerado: "Plano de treino gerado automaticamente.",
  criado_em: new Date()
});

db.getCollection('usuarios').insertOne({
    nome: "Yasmin",
    email: "ymws@cin.ufpe.br",
    senha: 555,
    criado_em: new Date()
});

const totalUsuarios = db.getCollection('usuarios').countDocuments({});
console.log("Total de usuários:", totalUsuarios);
