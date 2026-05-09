import React from 'react';

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="reports-container">
      {children}
      
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Esconder elementos desnecessários na impressão */
          nav, aside, footer, .no-print, button, .cl-userButton-root {
            display: none !important;
          }

          /* Resetar margens e cores para impressão */
          body, html {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .reports-container {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Forçar quebras de página controladas */
          .page-break {
            page-break-before: always;
            break-before: page;
          }

          .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }

          /* Ajustar cards para ocupar largura total no papel */
          .ui-card {
            box-shadow: none !important;
            border: 1px solid #eee !important;
            break-inside: avoid;
          }

          /* Melhorar tipografia para leitura em papel */
          h1, h2, h3 {
            color: black !important;
          }

          /* Customizar o cabeçalho do PDF */
          @page {
            margin: 20mm;
            size: A4 portrait;
          }
          
          /* Garantir que grid e flex funcionem */
          .grid {
            display: grid !important;
          }
          .flex {
            display: flex !important;
          }
        }
      `}} />
    </div>
  );
}
