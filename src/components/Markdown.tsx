"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders markdown (GFM) with dark-theme styling so AI replies show proper
 * headings, bold, bullet lists, tables and code — never raw ** _ - "" markers.
 */
export default function Markdown({ content }: { content: string }) {
  return (
    <div className="text-sm leading-relaxed text-slate-300 break-words [&>*:first-child]:mt-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => <h1 className="text-xl font-bold text-white mt-5 mb-2" {...props} />,
          h2: (props) => <h2 className="text-lg font-bold text-white mt-5 mb-2" {...props} />,
          h3: (props) => <h3 className="text-base font-bold text-white mt-4 mb-2" {...props} />,
          h4: (props) => <h4 className="text-sm font-bold text-white mt-3 mb-1.5" {...props} />,
          p: (props) => <p className="my-2.5" {...props} />,
          ul: (props) => <ul className="my-2.5 ml-5 list-disc space-y-1.5 marker:text-primary-light" {...props} />,
          ol: (props) => <ol className="my-2.5 ml-5 list-decimal space-y-1.5 marker:text-primary-light" {...props} />,
          li: (props) => <li className="leading-relaxed" {...props} />,
          strong: (props) => <strong className="font-semibold text-white" {...props} />,
          em: (props) => <em className="italic text-slate-200" {...props} />,
          a: (props) => <a className="text-primary-light underline hover:text-primary" target="_blank" rel="noreferrer" {...props} />,
          blockquote: (props) => <blockquote className="border-l-2 border-primary/50 pl-4 my-3 text-slate-400 italic" {...props} />,
          hr: () => <hr className="my-4 border-[#232b36]" />,
          code: ({ className, children, ...props }) => {
            const isBlock = (className || "").includes("language-");
            if (isBlock) {
              return (
                <code className={`block bg-[#0b0e13] border border-[#1b222c] text-slate-300 rounded-xl p-4 my-3 overflow-x-auto text-xs ${className || ""}`} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className="bg-[#0f141b] border border-[#1b222c] text-primary-light px-1.5 py-0.5 rounded text-xs" {...props}>
                {children}
              </code>
            );
          },
          pre: (props) => <pre className="my-3 overflow-x-auto" {...props} />,
          table: (props) => (
            <div className="my-3 overflow-x-auto">
              <table className="w-full text-xs border border-[#1b222c] rounded-lg overflow-hidden" {...props} />
            </div>
          ),
          thead: (props) => <thead className="bg-[#0f141b] text-slate-400" {...props} />,
          th: (props) => <th className="text-left px-3 py-2 font-medium border-b border-[#1b222c]" {...props} />,
          td: (props) => <td className="px-3 py-2 border-b border-[#1b222c]/60 text-slate-300" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
