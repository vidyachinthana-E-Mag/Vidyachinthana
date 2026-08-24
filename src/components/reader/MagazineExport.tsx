'use client';

import React from 'react';
import { Printer, FileDown, Download } from 'lucide-react';

export function MagazineExport({ issue, articles }: { issue: any; articles: any[] }) {
  const handlePrint = () => {
    window.print();
  };

  const handleExportDocx = async () => {
    // Dynamically import docx to avoid server-side errors
    const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');

    const docSections = [];

    docSections.push(
      new Paragraph({
        text: `Issue #${issue.number}: ${issue.title}`,
        heading: HeadingLevel.TITLE,
      }),
      new Paragraph({
        text: issue.description || '',
        spacing: { after: 400 },
      })
    );

    articles.forEach(({ article }) => {
      docSections.push(
        new Paragraph({
          text: article.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        }),
        new Paragraph({
          text: `By ${article.author?.name || 'Unknown'} | Category: ${article.category}`,
          heading: HeadingLevel.HEADING_3,
          spacing: { after: 200 },
        })
      );

      // Parse JSON content if available
      try {
        const parsedContent = JSON.parse(article.content || '{}');
        if (parsedContent.content) {
          parsedContent.content.forEach((block: any) => {
            if (block.type === 'paragraph' && block.content) {
              const text = block.content.map((c: any) => c.text).join('');
              docSections.push(
                new Paragraph({
                  text,
                  spacing: { after: 200 },
                })
              );
            }
          });
        }
      } catch (e) {
        docSections.push(
          new Paragraph({
            text: "Content parsing error or missing content.",
          })
        );
      }
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: docSections,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Vidya_Chinthana_Issue_${issue.number}.docx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-3 mt-6 no-print">
      <button 
        onClick={handlePrint}
        className="px-4 py-2 bg-slate-900 text-white rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-slate-800 transition shadow-sm"
      >
        <Printer size={16} />
        Print Paththara
      </button>
      <button 
        onClick={handlePrint} // Since we added @media print, it works perfectly for PDF as well via browser print->PDF
        className="px-4 py-2 bg-red-600 text-white rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-red-700 transition shadow-sm"
      >
        <FileDown size={16} />
        Export to PDF
      </button>
      <button 
        onClick={handleExportDocx}
        className="px-4 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
      >
        <Download size={16} />
        Export DOCX
      </button>
    </div>
  );
}
