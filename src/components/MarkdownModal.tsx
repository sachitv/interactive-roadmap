import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, Loader, X } from "lucide-react";

interface MarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdownPath: string;
  title: string;
}

export default function MarkdownModal(
  { isOpen, onClose, markdownPath, title }: MarkdownModalProps,
) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isOpen || !markdownPath) return;

    const loadMarkdown = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(markdownPath);
        if (!response.ok) {
          throw new Error(`Failed to load markdown: ${response.status}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [isOpen, markdownPath]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full h-full max-w-6xl mx-4 my-4 bg-white rounded-xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-gray-600" />
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto h-full">
          {loading
            ? (
              <div className="flex items-center justify-center h-64">
                <Loader className="w-8 h-8 animate-spin text-blue-500" />
                <span className="ml-3 text-gray-600">Loading content...</span>
              </div>
            )
            : error
            ? (
              <div className="flex items-center justify-center h-64 text-red-500">
                <p>Error: {error}</p>
              </div>
            )
            : (
              <div className="p-8">
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ ...props }) => (
                        <h1
                          className="text-4xl font-bold text-gray-900 mb-6 border-b-2 border-blue-200 pb-4"
                          {...props}
                        />
                      ),
                      h2: ({ ...props }) => (
                        <h2
                          className="text-3xl font-semibold text-gray-800 mb-4 mt-8"
                          {...props}
                        />
                      ),
                      h3: ({ ...props }) => (
                        <h3
                          className="text-2xl font-semibold text-gray-700 mb-3 mt-6"
                          {...props}
                        />
                      ),
                      p: ({ ...props }) => (
                        <p
                          className="text-gray-600 leading-relaxed mb-4"
                          {...props}
                        />
                      ),
                      ul: ({ ...props }) => (
                        <ul
                          className="list-disc list-inside text-gray-600 mb-4 space-y-2"
                          {...props}
                        />
                      ),
                      ol: ({ ...props }) => (
                        <ol
                          className="list-decimal list-inside text-gray-600 mb-4 space-y-2"
                          {...props}
                        />
                      ),
                      li: ({ ...props }) => (
                        <li className="leading-relaxed" {...props} />
                      ),
                      strong: ({ ...props }) => (
                        <strong
                          className="font-semibold text-gray-900"
                          {...props}
                        />
                      ),
                      code: ({ ...props }) => (
                        <code
                          className="bg-gray-100 text-gray-800 px-2 py-1 rounded font-mono text-sm"
                          {...props}
                        />
                      ),
                      pre: ({ ...props }) => (
                        <pre
                          className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4"
                          {...props}
                        />
                      ),
                      blockquote: ({ ...props }) => (
                        <blockquote
                          className="border-l-4 border-blue-200 pl-4 italic text-gray-600 mb-4"
                          {...props}
                        />
                      ),
                      table: ({ ...props }) => (
                        <table
                          className="min-w-full border-collapse border border-gray-300 mb-4"
                          {...props}
                        />
                      ),
                      th: ({ ...props }) => (
                        <th
                          className="border border-gray-300 bg-gray-50 px-4 py-2 text-left font-semibold"
                          {...props}
                        />
                      ),
                      td: ({ ...props }) => (
                        <td
                          className="border border-gray-300 px-4 py-2"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
