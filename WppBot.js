const { create } = require('@wppconnect-team/wppconnect');

let boasVindasEnviadas = false;
let clienteAtivo = null;

const palavrasDeAtivacao = ['bom dia', 'boa tarde', 'boa noite', 'oi', 'ola'];
var n;

async function start(client) {
  client.onMessage(async (message) => {
    if (!message.isGroupMsg) {
      const mensagemNormalizada = message.body.toLowerCase();
      const remetente = message.from;

      if (palavrasDeAtivacao.some(palavra => mensagemNormalizada.includes(palavra)) && (!clienteAtivo || clienteAtivo !== remetente)) {
        client.sendText(message.from, 'Olá! Seja bem-vindo(a) a VN desenvolvedora! 💻\nComo posso ajudá-lo?')
        n = message.from;
        await responderMenu(client);
        boasVindasEnviadas = true;
        clienteAtivo = remetente;
      } else if (boasVindasEnviadas && clienteAtivo === remetente) {
        // Aqui você pode adicionar lógica adicional para lidar com mensagens após a escolha do menu
        // Por exemplo, você pode chamar uma função para processar a escolha do menu
        processarEscolhaMenu(client, message);
      }
    }
  });

  // Restante do código...
}

async function main() {
  try {
    const client = await create({
      session: 'sessionName', 
      catchQR: (base64Qr, asciiQR) => {
        console.log(asciiQR);
      },
    });

    start(client);
  } catch (error) {
    console.error(error);
  }
}

async function responderMenu(client) {
  client.sendListMessage(n, {
    buttonText: 'Clique Aqui',
    description: 'Escolha uma opção',
    sections: [
      {
        title: 'VN desenvolvedora',
        rows: [
          {
            rowId: '1',
            title: 'Como desenvolver?',
          },
          {
            rowId: '2',
            title: 'Preciso de ajuda com um programa',
          },
          {
            rowId: '3',
            title: 'Preciso de um atendimento presencial',
          },
          {
            rowId: '4',
            title: 'Quero fazer perguntas fora do menu',
          },
        ],
      },
    ],
  });
}

async function processarEscolhaMenu(client, message) {
  const escolha = message.body.toLowerCase().trim(); // Converter para minúsculas e remover espaços extras

  switch (escolha) {
    case 'como desenvolver?':
      client.sendText(n, 'Desenvolver é mais simples do que parece, e eu vou te mostrar, só dá um clique aqui 👇 \n.');
      // Adicione lógica adicional conforme necessário
      break;
    case 'preciso de ajuda com um programa':
      client.sendText(n, 'Opa, posso te ajudar com isso, descreva seu problema aqui que já entraremos em contato.');
      // Adicione lógica adicional conforme necessário
      break;
    case 'preciso de um atendimento presencial':
      client.sendText(n, 'Me parece que você escolheu atendimento presencial! Entre em contato com meu assistente para marcar um horário.');
      // Adicione lógica adicional conforme necessário
      break;
    case 'quero fazer perguntas fora do menu':
      client.sendText(n, 'Por favor, pode descrever suas dúvidas aqui, iremos fazer o possível para te ajudar.');
      // Adicione lógica adicional conforme necessário
      break;
  }
}
main();