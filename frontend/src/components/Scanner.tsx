"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

const BarcodeScanner = dynamic(() => import("react-qr-barcode-scanner"), { ssr: false });

interface ScannerProps {
  onDetected: (code: string) => void;
}

const Scanner = ({ onDetected }: ScannerProps) => {
  const handleUpdate = useCallback((err: any, result: any) => {
    if (result) {
      onDetected(result.text);
    }
  }, [onDetected]);

  // Overlay dimensions
  const boxWidth = 380; // px
  const boxHeight = 100; // px

  // Animación de la línea naranja (de arriba hacia abajo)
  const [linePos, setLinePos] = useState(0);
  const [direction, setDirection] = useState(1);
  const lineSpeed = 2; // px por frame
  const lineHeight = 3;
  const lineColor = 'linear-gradient(90deg, #ff9800 0%, #ffb347 50%, #ff9800 100%)';

  useEffect(() => {
    let raf: number;
    const animate = () => {
      setLinePos(pos => {
        let next = pos + direction * lineSpeed;
        if (next > boxHeight - lineHeight) {
          setDirection(-1);
          next = boxHeight - lineHeight;
        } else if (next < 0) {
          setDirection(1);
          next = 0;
        }
        return next;
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [direction]);

  return (
    <div className="w-full h-full flex items-center justify-center rounded-2xl overflow-hidden relative" style={{background: 'transparent', boxShadow: '0 4px 32px 0 rgba(0,0,0,0.12)'}}>
      <div className="absolute w-full h-full z-0 flex items-center justify-center">
        <div style={{width: 480, height: 320, borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)'}}>
          <BarcodeScanner
            onUpdate={handleUpdate}
            width={480}
            height={320}
            facingMode="environment"
          />
        </div>
      </div>
      {/* Filtro oscuro fuera del rectángulo, dejando el centro claro (con 4 divs) */}
      <div className="absolute left-1/2 top-1/2 pointer-events-none z-10" style={{width: 480, height: 320, transform: 'translate(-50%, -50%)'}}>
        {/* Arriba */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 480, height: (320 - boxHeight) / 2, background: 'rgba(0,0,0,0.55)'}} />
        {/* Abajo */}
        <div style={{position: 'absolute', left: 0, top: (320 + boxHeight) / 2, width: 480, height: (320 - boxHeight) / 2, background: 'rgba(0,0,0,0.55)'}} />
        {/* Izquierda */}
        <div style={{position: 'absolute', left: 0, top: (320 - boxHeight) / 2, width: (480 - boxWidth) / 2, height: boxHeight, background: 'rgba(0,0,0,0.55)'}} />
        {/* Derecha */}
        <div style={{position: 'absolute', left: (480 + boxWidth) / 2, top: (320 - boxHeight) / 2, width: (480 - boxWidth) / 2, height: boxHeight, background: 'rgba(0,0,0,0.55)'}} />
        {/* Esquinas blancas */}
        {/* Esquina superior izquierda */}
        <div style={{position: 'absolute', left: (480 - boxWidth) / 2, top: (320 - boxHeight) / 2, width: 28, height: 6, background: '#fff', borderRadius: 3}} />
        <div style={{position: 'absolute', left: (480 - boxWidth) / 2, top: (320 - boxHeight) / 2, width: 6, height: 28, background: '#fff', borderRadius: 3}} />
        {/* Esquina superior derecha */}
        <div style={{position: 'absolute', right: (480 - boxWidth) / 2, top: (320 - boxHeight) / 2, width: 28, height: 6, background: '#fff', borderRadius: 3}} />
        <div style={{position: 'absolute', right: (480 - boxWidth) / 2, top: (320 - boxHeight) / 2, width: 6, height: 28, background: '#fff', borderRadius: 3}} />
        {/* Esquina inferior izquierda */}
        <div style={{position: 'absolute', left: (480 - boxWidth) / 2, bottom: (320 - boxHeight) / 2, width: 28, height: 6, background: '#fff', borderRadius: 3}} />
        <div style={{position: 'absolute', left: (480 - boxWidth) / 2, bottom: (320 - boxHeight) / 2, width: 6, height: 28, background: '#fff', borderRadius: 3}} />
        {/* Esquina inferior derecha */}
        <div style={{position: 'absolute', right: (480 - boxWidth) / 2, bottom: (320 - boxHeight) / 2, width: 28, height: 6, background: '#fff', borderRadius: 3}} />
        <div style={{position: 'absolute', right: (480 - boxWidth) / 2, bottom: (320 - boxHeight) / 2, width: 6, height: 28, background: '#fff', borderRadius: 3}} />
        {/* Línea naranja horizontal animada (de arriba hacia abajo) */}
        <div
          style={{
            position: 'absolute',
            left: (480 - boxWidth) / 2,
            top: (320 - boxHeight) / 2 + linePos,
            width: boxWidth,
            height: lineHeight,
            background: lineColor,
            boxShadow: '0 0 12px 2px #ff9800',
            opacity: 0.95,
            borderRadius: 2,
            transition: 'top 0.05s linear',
          }}
        />
      </div>
    </div>
  );
};

export default Scanner; 