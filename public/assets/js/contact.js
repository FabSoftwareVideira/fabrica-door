// document.addEventListener("DOMContentLoaded", function () {
//   const contactForm = document.getElementById("contact-form");
//   if (!contactForm) return;

//   contactForm.addEventListener("submit", async function (e) {
//     e.preventDefault();

//     // Limpar mensagens anteriores
//     const existingMessage = contactForm.querySelector(".form-message");
//     if (existingMessage) existingMessage.remove();

//     const submitButton = this.querySelector('button[type="submit"]');
//     const originalText = submitButton.textContent;

//     // Obter campos do formulário
//     const formData = new FormData(this);
//     const formEntries = Object.fromEntries(formData);
//     const { nome, email, mensagem } = formEntries;

//     // Validações
//     try {
//       // Validar campos obrigatórios
//       if (!nome || !email || !mensagem) {
//         throw new Error("Todos os campos são obrigatórios");
//       }

//       // Validar formato do email
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         throw new Error("Por favor, insira um email válido");
//       }

//       // Validar comprimento mínimo
//       if (nome.length < 2) {
//         throw new Error("O nome deve ter pelo menos 2 caracteres");
//       }
//       if (mensagem.length < 10) {
//         throw new Error("A mensagem deve ter pelo menos 10 caracteres");
//       }

//       // Prevenir XSS básico
//       const sanitizeInput = (input) => {
//         const temp = document.createElement("div");
//         temp.textContent = input;
//         return temp.innerHTML;
//       };

//       // Obter a API_KEY da configuração global
//       const API_KEY = window.CONFIG ? window.CONFIG.API_KEY : "";
//       const EMAIL_FABRICA = window.CONFIG ? window.CONFIG.EMAIL_FABRICA : "";

//       // Preparar dados sanitizados
//       const emailData = {
//         destinatario: EMAIL_FABRICA,
//         assunto: "[Fábrica] Nova mensagem de contato",
//         corpo: window.createContactEmailBody({
//           nome: sanitizeInput(nome),
//           email: sanitizeInput(email),
//           assunto: sanitizeInput(formEntries.assunto),
//           mensagem: sanitizeInput(mensagem),
//         }),
//       };

//       // Desabilitar botão durante o envio
//       submitButton.disabled = true;
//       submitButton.textContent = "Enviando...";

//       const response = await fetch(
//         "https://fsw-ifc.brdrive.net/services/email/api/enviar-email",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Accept: "application/json",
//             "X-API-KEY": `${API_KEY}`,
//           },
//           body: JSON.stringify(emailData),
//         }
//       );

//       if (response.ok) {
//         // Mostrar mensagem de sucesso
//         submitButton.textContent = "Enviado!";
//         const formMessage = document.createElement("div");
//         formMessage.className = "form-message success";
//         formMessage.textContent = "Sua mensagem foi enviada com sucesso.";
//         contactForm.appendChild(formMessage);
//         contactForm.reset();

//         // Resetar botão após 2 segundos
//         setTimeout(() => {
//           submitButton.textContent = originalText;
//         }, 2000);
//       } else {
//         throw new Error("Erro na resposta do servidor");
//       }
//     } catch (error) {
//       // Mostrar mensagem de erro
//       const formMessage = document.createElement("div");
//       formMessage.className = "form-message error";
//       formMessage.textContent = "Falha ao enviar a mensagem. Tente novamente.";
//       contactForm.appendChild(formMessage);

//       console.error("Erro:", error);
//     } finally {
//       // Reativar botão em caso de sucesso ou falha
//       submitButton.disabled = false;
//       if (!contactForm.querySelector(".form-message.success")) {
//         submitButton.textContent = originalText;
//       }
//     }
//   });
// });
