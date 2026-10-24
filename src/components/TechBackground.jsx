import React, { useEffect, useRef } from 'react';

/**
 * 科技感背景組件
 * 提供動態粒子、數據流、電路線條等科技視覺效果
 */
const TechBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    // 設置畫布尺寸
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // 粒子類別
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = this.getRandomColor();
      }

      getRandomColor() {
        const colors = [
          '#00bcd4', // Tech primary
          '#2196f3', // Tech secondary
          '#4caf50', // Tech accent
          '#00ffff', // Tech neon
          '#ff6ec7'  // Tech electric
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // 邊界反彈
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // 保持在畫布內
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }

    // 連線類別
    class Connection {
      constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.distance = this.getDistance();
        this.maxDistance = 120;
      }

      getDistance() {
        const dx = this.p1.x - this.p2.x;
        const dy = this.p1.y - this.p2.y;
        return Math.sqrt(dx * dx + dy * dy);
      }

      draw() {
        this.distance = this.getDistance();

        if (this.distance < this.maxDistance) {
          const opacity = (1 - this.distance / this.maxDistance) * 0.3;

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = '#00bcd4';
          ctx.lineWidth = 1;
          ctx.shadowColor = '#00bcd4';
          ctx.shadowBlur = 5;

          ctx.beginPath();
          ctx.moveTo(this.p1.x, this.p1.y);
          ctx.lineTo(this.p2.x, this.p2.y);
          ctx.stroke();

          ctx.restore();
        }
      }
    }

    // 初始化粒子
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(50, Math.floor(canvas.width * canvas.height / 15000));

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(new Particle());
      }
    };

    // 動畫循環
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 更新和繪製粒子
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // 繪製連線
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const connection = new Connection(
            particlesRef.current[i],
            particlesRef.current[j]
          );
          connection.draw();
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    // 初始化
    resizeCanvas();
    initParticles();
    animate();

    // 視窗大小改變時重新初始化
    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // 清理函數
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* 動態粒子畫布 */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          pointerEvents: 'none',
          background: 'transparent'
        }}
      />

      {/* 靜態背景效果 */}
      <div className="tech-background">
        {/* 粒子效果 */}
        <div className="tech-particles"></div>

        {/* 數據流 */}
        {[...Array(5)].map((_, i) => (
          <div key={i} className="data-stream"></div>
        ))}

        {/* 電路線條 */}
        <div className="circuit-lines"></div>

        {/* 矩陣雨效果 */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="matrix-rain"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            {Math.random().toString(36).substring(2, 8)}
          </div>
        ))}

        {/* 光束效果 */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="light-beam"
            style={{
              left: `${20 + i * 30}%`,
              animationDelay: `${i * 0.5}s`
            }}
          ></div>
        ))}
      </div>

      {/* 樣式 */}
      <style jsx>{`
        .tech-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
        }

        .tech-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(2px 2px at 20px 30px, #00ffff, transparent),
            radial-gradient(2px 2px at 40px 70px, #00bcd4, transparent),
            radial-gradient(1px 1px at 90px 40px, #2196f3, transparent),
            radial-gradient(1px 1px at 130px 80px, #4caf50, transparent),
            radial-gradient(2px 2px at 160px 30px, #ff6ec7, transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          animation: particleFloat 2.4s linear infinite;
          opacity: 0.1;
        }

        @keyframes particleFloat {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-100px) rotate(360deg); }
        }

        .data-stream {
          position: absolute;
          width: 1px;
          height: 100px;
          background: linear-gradient(180deg, transparent, #00ffff, transparent);
          animation: dataFlow 1.2s linear infinite;
          opacity: 0.6;
        }

        .data-stream:nth-child(2) { left: 10%; animation-delay: 0s; }
        .data-stream:nth-child(3) { left: 25%; animation-delay: 0.5s; }
        .data-stream:nth-child(4) { left: 45%; animation-delay: 1s; }
        .data-stream:nth-child(5) { left: 65%; animation-delay: 1.5s; }
        .data-stream:nth-child(6) { left: 85%; animation-delay: 2s; }

        @keyframes dataFlow {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        .circuit-lines {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image:
            linear-gradient(90deg, #00bcd4 1px, transparent 1px),
            linear-gradient(180deg, #00bcd4 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.1;
          animation: circuitPulse 2.4s ease-in-out infinite;
        }

        @keyframes circuitPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        .matrix-rain {
          position: absolute;
          color: #4caf50;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.2;
          animation: matrixDrop 1.2s linear infinite;
          opacity: 0.7;
        }

        @keyframes matrixDrop {
          0% {
            transform: translateY(-100px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh);
            opacity: 0;
          }
        }

        .light-beam {
          position: absolute;
          width: 2px;
          height: 100%;
          background: linear-gradient(
            0deg,
            transparent,
            #00ffff,
            transparent
          );
          animation: beamPulse 1.2s ease-in-out infinite;
        }

        @keyframes beamPulse {
          0%, 100% { opacity: 0; transform: scaleY(0); }
          50% { opacity: 1; transform: scaleY(1); }
        }

        @media (max-width: 768px) {
          .data-stream {
            height: 50px;
          }

          .matrix-rain {
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tech-particles,
          .data-stream,
          .circuit-lines,
          .matrix-rain,
          .light-beam {
            animation: none;
          }
        }
      `}</style>
    </>
  );
};

export default TechBackground;