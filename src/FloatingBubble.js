import React, { useState } from 'react';

const FloatingBubble = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div 
        className={`floating-bubble ${isHovered ? 'hovered' : ''}`}
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="bubble-icon">🏁</div>
        {isHovered && (
          <div className="bubble-tooltip">
            <strong>Gas Monster</strong>
            <p>Tu revista del motor</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .floating-bubble {
          position: fixed;
          bottom: 32px;
          right: 32px;
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #E50914 0%, #8B0000 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 9999;
          box-shadow: 0 8px 32px rgba(229, 9, 20, 0.6);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: float 3s ease-in-out infinite, pulse 2s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.02);
          }
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 32px rgba(229, 9, 20, 0.6);
          }
          50% {
            box-shadow: 0 8px 48px rgba(229, 9, 20, 0.9), 0 0 0 0 rgba(229, 9, 20, 0.4);
          }
        }

        .floating-bubble::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: linear-gradient(135deg, #E50914 0%, #ff4757 50%, #E50914 100%);
          border-radius: 50%;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s;
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .floating-bubble.hovered::before {
          opacity: 1;
        }

        .floating-bubble:hover {
          transform: scale(1.15) translateY(-5px);
          box-shadow: 0 12px 48px rgba(229, 9, 20, 0.8);
        }

        .floating-bubble:active {
          transform: scale(1.05);
        }

        .bubble-icon {
          font-size: 36px;
          animation: wiggle 1s ease-in-out infinite;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        @keyframes wiggle {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        .bubble-tooltip {
          position: absolute;
          right: 90px;
          background: rgba(26, 26, 26, 0.98);
          border: 2px solid #E50914;
          border-radius: 12px;
          padding: 12px 16px;
          white-space: nowrap;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
          animation: tooltipIn 0.3s ease;
          backdrop-filter: blur(10px);
        }

        @keyframes tooltipIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .bubble-tooltip::after {
          content: '';
          position: absolute;
          right: -10px;
          top: 50%;
          transform: translateY(-50%);
          width: 0;
          height: 0;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          border-left: 10px solid #E50914;
        }

        .bubble-tooltip strong {
          display: block;
          font-size: 16px;
          font-weight: 700;
          background: linear-gradient(135deg, #E50914 0%, #ff4757 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 4px;
        }

        .bubble-tooltip p {
          font-size: 12px;
          color: #999;
          margin: 0;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .floating-bubble {
            width: 60px;
            height: 60px;
            bottom: 24px;
            right: 24px;
          }

          .bubble-icon {
            font-size: 30px;
          }

          .bubble-tooltip {
            right: 80px;
            padding: 10px 14px;
          }

          .bubble-tooltip strong {
            font-size: 14px;
          }

          .bubble-tooltip p {
            font-size: 11px;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingBubble;