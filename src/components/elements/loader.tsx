import Image from 'next/image';

const Loader = () => {
  return (
    <>
      <div className="loader-container">
        <div className="loader-frame">
          {/* Corner brackets */}
          <div className="corner top-left"></div>
          <div className="corner top-right"></div>
          <div className="corner bottom-left"></div>
          <div className="corner bottom-right"></div>

          {/* Logo and Glitching Letters */}
          <div className="logo-wrapper">
            <Image
              src="/YPlogo.png"
              alt="Cypher Vision Logo"
              width={150}
              height={150}
              className="main-logo"
              priority
            />
            <Image
              src="/YP letters.png"
              alt="YP Letters"
              width={150}
              height={150}
              className="glitch-letters"
              priority
            />
          </div>

          {/* Text */}
          <div className="text-wrapper">
            <h1 className="title-text">ED ANHILILATOR</h1>
            <p className="subtitle-text">by Cypher Vision</p>
            <p className="loading-text">INITIALIZING...</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --loader-bg-color: #0a0a0a;
          --primary-glow-color: #00ffff;
          --secondary-text-color: #a0a0a0;
          --glitch-glow-color: #ff00ff;
        }

        .loader-container {
          display: flex;
          justify-content: center;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: var(--loader-bg-color);
          font-family: var(--font-sans), sans-serif; /* Uses Oxanium from globals.css */
          color: var(--primary-glow-color);
          opacity: 0;
          animation: fadeIn 0.5s ease forwards;
          z-index: 9999;
        }

        .loader-frame {
          position: relative;
          padding: 40px;
          border: 1px solid var(--primary-glow-color);
          box-shadow: 0 0 15px var(--primary-glow-color), inset 0 0 15px var(--primary-glow-color);
          text-align: center;
        }

        .corner {
          position: absolute;
          width: 20px;
          height: 20px;
          border-color: var(--primary-glow-color);
          border-style: solid;
        }
        .top-left { top: -2px; left: -2px; border-width: 2px 0 0 2px; }
        .top-right { top: -2px; right: -2px; border-width: 2px 2px 0 0; }
        .bottom-left { bottom: -2px; left: -2px; border-width: 0 0 2px 2px; }
        .bottom-right { bottom: -2px; right: -2px; border-width: 0 2px 2px 0; }

        .logo-wrapper {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto 20px auto;
        }

        .main-logo {
          width: 100%;
          height: 100%;
          filter: drop-shadow(0 0 8px var(--primary-glow-color));
          animation: pulse 2s infinite ease-in-out;
        }

        .glitch-letters {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.9;
          mix-blend-mode: hard-light;
          animation: glitch 1.5s infinite steps(1, end);
        }

        .text-wrapper {
          animation: textFlicker 3s infinite;
        }
        
        .title-text {
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-shadow: 0 0 5px var(--primary-glow-color);
        }

        .subtitle-text {
          font-size: 0.9rem;
          color: var(--secondary-text-color);
          margin-bottom: 20px;
          letter-spacing: 0.1em;
        }

        .loading-text {
          font-size: 1rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          animation: loadingFlicker 1s infinite;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { filter: drop-shadow(0 0 8px var(--primary-glow-color)); }
          50% { filter: drop-shadow(0 0 15px var(--primary-glow-color)); }
        }

        @keyframes glitch {
          0%, 100% { transform: translate(0, 0); opacity: 0.9; }
          10% { transform: translate(-2px, 2px); }
          20% { transform: translate(2px, -2px); opacity: 0.5; }
          30% { transform: translate(0, 0); filter: drop-shadow(0 0 5px var(--glitch-glow-color)); }
          40% { transform: translate(2px, 2px); opacity: 0.9; }
          50% { transform: translate(-2px, -2px); }
          60% { transform: translate(0, 0); opacity: 0.3; }
          70% { transform: translate(0, 0); clip-path: inset(50% 0 0 0); }
          80% { transform: translate(0, 0); clip-path: none; opacity: 0.9; }
          90% { transform: translate(-2px, 0); filter: none; }
        }
        
        @keyframes textFlicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.9; }
        }

        @keyframes loadingFlicker {
            0%, 100% { opacity: 1; }
            50.5% { opacity: 0.6; }
        }
      `}</style>
    </>
  );
};

export default Loader;
