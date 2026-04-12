'use client';

import { useState } from 'react';

export default function TermsModal({ content, buttonText = "View Terms & Conditions", title = "Terms & Conditions", showAsButton = false }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!content) return null;

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

      {/* Trigger Button/Link */}
      <div className="text-center mt-8">
        {showAsButton ? (
          <button
            onClick={() => setIsOpen(true)}
            className="inline-block bg-[#c8ff00] hover:bg-[#e80f4b] px-8 py-4 rounded-xl font-extrabold text-white text-base uppercase tracking-wider transition-all duration-300 hover:scale-105"
          >
            {buttonText}
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="text-white/80 hover:text-[#c8ff00] underline underline-offset-4 font-semibold text-sm transition-colors duration-300"
          >
            {buttonText}
          </button>
        )}
      </div>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-[fadeIn_0.3s_ease-out]"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative bg-gradient-to-br from-gray-900 to-black border-2 border-[#c8ff00]/50 rounded-2xl max-w-7xl max-h-[90vh] overflow-hidden w-full animate-[scaleIn_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#c8ff00] to-[#2ED60F] px-6 py-4 border-b-2 border-[#c8ff00]/30">
              <div className="flex justify-between items-center">
                <h3 className="font-black text-white text-2xl uppercase tracking-wide">
                  {title}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center items-center bg-white/10 hover:bg-white/20 rounded-full w-10 h-10 font-bold text-white text-xl transition-all duration-300 hover:rotate-90"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-160px)]">
              <div
                className="prose prose-invert prose-sm sm:prose-base max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-p:text-white/80 prose-p:leading-relaxed
                  prose-li:text-white/80
                  prose-strong:text-[#c8ff00]
                  prose-a:text-[#c8ff00] prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-gray-900 to-black px-6 py-4 border-t-2 border-[#c8ff00]/30">
              <button
                onClick={() => setIsOpen(false)}
                className="bg-[#c8ff00] hover:bg-[#e80f4b] mx-auto px-8 py-3 rounded-xl font-extrabold text-white text-sm uppercase tracking-wider transition-all duration-300 block"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
