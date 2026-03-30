// // static/js/emailTemplates.js

// function createContactEmailBody(formEntries) {
//   const date = new Date().toLocaleString("pt-BR");
//   return `
//       <html>
//         <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
//           <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px;">
//             Nova Mensagem de Contato
//           </h2>
//           <p>Uma nova mensagem foi enviada através do formulário de contato:</p>
//           <table style="width: 100%; max-width: 600px; border-collapse: collapse; margin: 20px 0;">
//             ${Object.entries(formEntries)
//               .map(
//                 ([key, value], index) => `
//                   <tr style="background-color: ${
//                     index % 2 === 0 ? "#f9f9f9" : "#fff"
//                   };">
//                     <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; text-transform: capitalize;">
//                       ${key}
//                     </td>
//                     <td style="padding: 10px; border: 1px solid #ddd;">
//                       ${value || "(Não informado)"}
//                     </td>
//                   </tr>
//                 `
//               )
//               .join("")}
//           </table>
//           <p style="font-size: 0.9em; color: #7f8c8d;">
//             Enviado em: ${date}
//           </p>
//           <footer style="margin-top: 20px; padding-top: 10px; border-top: 1px solid #eee; font-size: 0.8em; color: #95a5a6;">
//             Mensagem automática gerada pelo sistema Fábrica.
//           </footer>
//         </body>
//       </html>
//     `;
// }

// // Tornar a função disponível globalmente
// window.createContactEmailBody = createContactEmailBody;
