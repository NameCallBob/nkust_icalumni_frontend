import React from 'react';

/**
 * 科技感載入組件
 * 提供多種科技風格的載入動畫
 */
const TechLoader = ({ type = 'circuit', size = 'medium', text = '載入中...' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'tech-loader-small';
      case 'large': return 'tech-loader-large';
      default: return 'tech-loader-medium';
    }
  };

  const renderLoader = () => {
    switch (type) {
      case 'circuit':
        return <CircuitLoader />;
      case 'radar':
        return <RadarLoader />;
      case 'matrix':
        return <MatrixLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'data':
        return <DataLoader />;
      default:
        return <CircuitLoader />;
    }
  };

  return (
    <div className={`tech-loader-container ${getSizeClass()}`}>
      {renderLoader()}
      {text && <div className="tech-loader-text">{text}</div>}

      <style jsx>{`
        .tech-loader-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }

        .tech-loader-small {
          transform: scale(0.7);
        }

        .tech-loader-medium {
          transform: scale(1);
        }

        .tech-loader-large {
          transform: scale(1.3);
        }

        .tech-loader-text {
          color: #00bcd4;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 2px;
          text-shadow: 0 0 10px rgba(0, 188, 212, 0.5);
          animation: textPulse 1.5s ease-in-out infinite;
        }

        @keyframes textPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// 電路載入器
const CircuitLoader = () => (
  <div className="circuit-loader">
    <div className="circuit-core"></div>
    <div className="circuit-ring ring-1"></div>
    <div className="circuit-ring ring-2"></div>
    <div className="circuit-ring ring-3"></div>

    <style jsx>{`
      .circuit-loader {
        position: relative;
        width: 80px;
        height: 80px;
      }

      .circuit-core {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        background: #00ffff;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 20px #00ffff;
        animation: coreGlow 1s ease-in-out infinite alternate;
      }

      .circuit-ring {
        position: absolute;
        border: 2px solid transparent;
        border-radius: 50%;
        animation: ringRotate 2s linear infinite;
      }

      .ring-1 {
        top: 10px;
        left: 10px;
        width: 60px;
        height: 60px;
        border-top-color: #00bcd4;
        border-right-color: #00bcd4;
        animation-duration: 1.5s;
      }

      .ring-2 {
        top: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        border-bottom-color: #2196f3;
        border-left-color: #2196f3;
        animation-duration: 2s;
        animation-direction: reverse;
      }

      .ring-3 {
        top: 5px;
        left: 5px;
        width: 70px;
        height: 70px;
        border-top-color: #4caf50;
        border-bottom-color: #4caf50;
        animation-duration: 2.5s;
      }

      @keyframes coreGlow {
        0% { box-shadow: 0 0 20px #00ffff; }
        100% { box-shadow: 0 0 30px #00ffff, 0 0 40px #00ffff; }
      }

      @keyframes ringRotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// 雷達載入器
const RadarLoader = () => (
  <div className="radar-loader">
    <div className="radar-screen"></div>
    <div className="radar-sweep"></div>
    <div className="radar-dot dot-1"></div>
    <div className="radar-dot dot-2"></div>
    <div className="radar-dot dot-3"></div>

    <style jsx>{`
      .radar-loader {
        position: relative;
        width: 80px;
        height: 80px;
        border: 2px solid #00bcd4;
        border-radius: 50%;
        background: radial-gradient(circle, transparent 30%, rgba(0, 188, 212, 0.1) 70%);
      }

      .radar-screen {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 60px;
        height: 60px;
        border: 1px solid rgba(0, 188, 212, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }

      .radar-sweep {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 2px;
        height: 35px;
        background: linear-gradient(0deg, transparent, #00ffff);
        transform-origin: bottom center;
        animation: radarSweep 2s linear infinite;
        box-shadow: 0 0 10px #00ffff;
      }

      .radar-dot {
        position: absolute;
        width: 4px;
        height: 4px;
        background: #4caf50;
        border-radius: 50%;
        box-shadow: 0 0 8px #4caf50;
        animation: dotBlink 1s ease-in-out infinite;
      }

      .dot-1 {
        top: 20px;
        left: 60px;
        animation-delay: 0s;
      }

      .dot-2 {
        top: 50px;
        left: 25px;
        animation-delay: 0.3s;
      }

      .dot-3 {
        top: 35px;
        left: 45px;
        animation-delay: 0.6s;
      }

      @keyframes radarSweep {
        0% { transform: translate(-50%, -100%) rotate(0deg); }
        100% { transform: translate(-50%, -100%) rotate(360deg); }
      }

      @keyframes dotBlink {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
      }
    `}</style>
  </div>
);

// 矩陣載入器
const MatrixLoader = () => (
  <div className="matrix-loader">
    {[...Array(6)].map((_, i) => (
      <div key={i} className={`matrix-column column-${i + 1}`}>
        {Math.random().toString(36).substring(2, 8).split('').map((char, j) => (
          <span key={j} className="matrix-char">{char}</span>
        ))}
      </div>
    ))}

    <style jsx>{`
      .matrix-loader {
        display: flex;
        gap: 4px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        font-weight: bold;
      }

      .matrix-column {
        display: flex;
        flex-direction: column;
        animation: matrixDrop 1.5s linear infinite;
      }

      .matrix-char {
        color: #4caf50;
        text-shadow: 0 0 5px #4caf50;
        opacity: 0;
        animation: charFade 0.5s ease-in-out infinite;
      }

      .column-1 { animation-delay: 0s; }
      .column-2 { animation-delay: 0.2s; }
      .column-3 { animation-delay: 0.4s; }
      .column-4 { animation-delay: 0.6s; }
      .column-5 { animation-delay: 0.8s; }
      .column-6 { animation-delay: 1s; }

      @keyframes matrixDrop {
        0% { transform: translateY(-20px); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(20px); opacity: 0; }
      }

      @keyframes charFade {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
    `}</style>
  </div>
);

// 脈衝載入器
const PulseLoader = () => (
  <div className="pulse-loader">
    <div className="pulse-ring ring-1"></div>
    <div className="pulse-ring ring-2"></div>
    <div className="pulse-ring ring-3"></div>
    <div className="pulse-center"></div>

    <style jsx>{`
      .pulse-loader {
        position: relative;
        width: 80px;
        height: 80px;
      }

      .pulse-ring {
        position: absolute;
        border: 2px solid #00bcd4;
        border-radius: 50%;
        animation: pulseExpand 2s ease-out infinite;
      }

      .ring-1 {
        top: 10px;
        left: 10px;
        width: 60px;
        height: 60px;
        animation-delay: 0s;
      }

      .ring-2 {
        top: 5px;
        left: 5px;
        width: 70px;
        height: 70px;
        animation-delay: 0.3s;
      }

      .ring-3 {
        top: 0px;
        left: 0px;
        width: 80px;
        height: 80px;
        animation-delay: 0.6s;
      }

      .pulse-center {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        background: #00ffff;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 20px #00ffff;
        animation: centerPulse 1s ease-in-out infinite;
      }

      @keyframes pulseExpand {
        0% {
          transform: scale(0.8);
          opacity: 1;
        }
        100% {
          transform: scale(1.2);
          opacity: 0;
        }
      }

      @keyframes centerPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.2); }
      }
    `}</style>
  </div>
);

// 數據載入器
const DataLoader = () => (
  <div className="data-loader">
    <div className="data-bars">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`data-bar bar-${i + 1}`}></div>
      ))}
    </div>
    <div className="data-text">
      <span>DATA</span>
      <span className="loading-dots">...</span>
    </div>

    <style jsx>{`
      .data-loader {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 16px;
      }

      .data-bars {
        display: flex;
        gap: 4px;
        align-items: end;
        height: 40px;
      }

      .data-bar {
        width: 6px;
        background: linear-gradient(0deg, #00bcd4, #00ffff);
        border-radius: 3px;
        animation: barPulse 1s ease-in-out infinite;
      }

      .bar-1 { height: 20px; animation-delay: 0s; }
      .bar-2 { height: 35px; animation-delay: 0.1s; }
      .bar-3 { height: 40px; animation-delay: 0.2s; }
      .bar-4 { height: 30px; animation-delay: 0.3s; }
      .bar-5 { height: 25px; animation-delay: 0.4s; }

      .data-text {
        color: #00bcd4;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        font-weight: bold;
        letter-spacing: 2px;
      }

      .loading-dots {
        animation: dotsPulse 1.5s ease-in-out infinite;
      }

      @keyframes barPulse {
        0%, 100% { opacity: 0.3; transform: scaleY(0.5); }
        50% { opacity: 1; transform: scaleY(1); }
      }

      @keyframes dotsPulse {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
      }
    `}</style>
  </div>
);

export default TechLoader;