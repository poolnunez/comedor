"use client";

import { useState } from "react";
import Scanner from "@/components/Scanner";

// Simulación de registros del día (esto luego se conecta al backend)
type RegistroHoy = { codigo: string, nombre: string, carrera: string, turno: string, hora: string };
const registrosHoyMock: RegistroHoy[] = [];

export default function RegistroComedorPage() {
  const [scannedCode, setScannedCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [estudiante, setEstudiante] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [registrosHoy, setRegistrosHoy] = useState(registrosHoyMock);
  const [turnoReservado, setTurnoReservado] = useState<string | null>(null);

  // Buscar estudiante por código
  const fetchEstudiante = async (codigo: string) => {
    setError(null);
    setEstudiante(null);
    setTurnoReservado(null);
    if (!codigo) return;
    try {
      const res = await fetch(`http://localhost:8080/api/estudiantes/${codigo}`);
      if (!res.ok) {
        setError("Estudiante no encontrado");
        return;
      }
      const data = await res.json();
      setEstudiante(data);
      // Consultar turno reservado
      const resTurno = await fetch(`http://localhost:8080/api/reservas/reserva-hoy/${codigo}`);
      if (resTurno.ok) {
        const reserva = await resTurno.json();
        if (reserva && reserva.turno) {
          setTurnoReservado(reserva.turno);
        }
      }
    } catch (err) {
      setError("");
    }
  };

  // Cuando se detecta un código por cámara
  const handleDetected = (code: string) => {
    setScannedCode(code);
    fetchEstudiante(code);
  };

  // Cuando se escribe manualmente
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setScannedCode(code);
    if (code.length > 0) {
      fetchEstudiante(code);
    } else {
      setEstudiante(null);
      setError(null);
    }
  };

  // Registrar ingreso (igual que antes)
  const handleRegister = async () => {
    if (!scannedCode) {
      setMessage("Por favor, escanee un código de estudiante.");
      return;
    }
    setIsLoading(true);
    setMessage("");
    try {
      const response = await fetch("http://localhost:8080/api/registros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ codigoEstudiante: scannedCode }),
      });
      if (response.status === 201) {
        const result = await response.json();
        setMessage(`✅ Registro exitoso para el código: ${result.codigoEstudiante}`);
        setScannedCode("");
        setEstudiante(null);
        setError(null);
        // Agregar a la lista de registros del día con carrera y turno
        setRegistrosHoy(prev => [
          {
            codigo: result.codigoEstudiante,
            nombre: estudiante?.nombres || "-",
            carrera: estudiante?.carrera || "-",
            turno: turnoReservado || "-",
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          ...prev
        ]);
      } else {
        const errorData = await response.text();
        setMessage(`❌ Error al registrar: ${errorData}`);
      }
    } catch (error) {
      setMessage("❌ No se pudo conectar con el servidor. ¿Está el backend en ejecución?");
    } finally {
      setIsLoading(false);
    }
  };

  // Exportar CSV (simulado)
  const handleExport = () => {
    if (registrosHoy.length === 0) return;
    const csv = [
      ["Código", "Nombre", "Carrera", "Turno", "Hora"],
      ...registrosHoy.map(r => [r.codigo, r.nombre, r.carrera, r.turno, r.hora])
    ].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "asistencia_hoy.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Contadores
  const totalHoy = registrosHoy.length;
  const totalGeneral = 6 + totalHoy; // Simulado

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-300 flex flex-col px-2 md:px-8 py-4">
      {/* Barra superior */}
      <header className="w-full px-6 py-4 flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400 shadow-lg rounded-b-3xl">
        <div className="flex items-center gap-4">
          <span className="material-icons text-white text-4xl">restaurant</span>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow">Comedor UNFV</h1>
            <span className="text-white/90 font-medium text-sm">Sistema de Control de Asistencia</span>
          </div>
        </div>
        <div className="flex gap-8 mt-4 md:mt-0">
          <div className="flex flex-col items-center">
            <span className="text-white/80 text-xs">Hoy</span>
            <span className="text-2xl font-bold text-white drop-shadow">{totalHoy}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-white/80 text-xs">Total</span>
            <span className="text-2xl font-bold text-white drop-shadow">{totalGeneral}</span>
          </div>
        </div>
      </header>
      {/* Grid principal */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-2 py-8 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
        {/* Escáner y registro */}
        <section className="col-span-2 flex flex-col gap-6">
          <div className="bg-white/90 dark:bg-gray-900/80 rounded-3xl shadow-xl p-8 flex flex-col gap-4 border border-orange-200 dark:border-orange-400">
            <h2 className="text-xl font-bold text-orange-600 mb-2 flex items-center gap-2">
              <span className="material-icons text-orange-400">qr_code_scanner</span>
              Escáner de Códigos de Barras
            </h2>
            <div className="w-full flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-2/3 flex flex-col items-center">
                <div className="w-full h-64 relative">
                  <Scanner onDetected={handleDetected} />
                </div>
                <div className="w-full mt-4 flex flex-col gap-2">
                  <label htmlFor="scanned-code" className="block text-sm font-semibold text-gray-800 dark:text-gray-100 mb-1">
                    Ingreso Manual
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="scanned-code"
                      type="text"
                      value={scannedCode}
                      onChange={handleInputChange}
                      placeholder="Ingrese código del estudiante (ej: 2023024011)"
                      className="flex-1 px-4 py-2 border-2 border-orange-300 dark:border-orange-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:text-white text-lg font-mono bg-white/80"
                    />
                    <button
                      onClick={handleRegister}
                      disabled={isLoading || !estudiante}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 text-white font-bold rounded-xl shadow-md hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-lg"
                    >
                      {isLoading ? "Registrando..." : <span className="material-icons">check_circle</span>}
                    </button>
                  </div>
                  {error && <div className="text-red-600 text-center font-semibold mb-2">{error}</div>}
                  {message && (
                    <div className={`mt-2 text-center text-base font-semibold ${message.startsWith('❌') ? 'text-red-600 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                      {message}
                    </div>
                  )}
                </div>
              </div>
              {/* Info del estudiante */}
              <div className="w-full md:w-1/2 flex flex-col items-center min-h-[300px]">
                {estudiante ? (
                  <div className="w-full flex flex-col items-center bg-white/95 dark:bg-gray-800/90 rounded-2xl shadow p-8 border border-orange-100 dark:border-orange-700 min-h-[320px]">
                    <div className="relative mb-4">
                      <img
                        src={estudiante.foto}
                        alt="Foto del estudiante"
                        className="w-36 h-36 rounded-full object-cover border-4 border-orange-300 shadow-md bg-white"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-1">{estudiante.nombres}</div>
                      <div className="text-lg text-gray-700 dark:text-gray-200 font-mono">{estudiante.codigo}</div>
                      <div className="flex flex-wrap justify-center gap-2 mt-2">
                        <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 rounded-full text-sm font-semibold">{estudiante.carrera}</span>
                        <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-full text-sm font-semibold">{estudiante.local}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 mb-2 text-base text-gray-800 dark:text-gray-100 mt-6 w-full">
                      <div className="flex items-center gap-2"><span className="material-icons text-orange-400">school</span><b>Facultad:</b> {estudiante.facultad}</div>
                      <div className="flex items-center gap-2"><span className="material-icons text-orange-400">apartment</span><b>Escuela:</b> {estudiante.escuela}</div>
                      <div className="flex items-center gap-2"><span className="material-icons text-orange-400">badge</span><b>DNI:</b> {estudiante.dni}</div>
                    </div>
                    {turnoReservado && (
                      <div className="w-full mt-4 rounded-2xl bg-green-800 flex items-center gap-3 px-6 py-4">
                        <span className="material-icons text-green-300 text-3xl">check_circle</span>
                        <span className="text-green-100 text-lg font-bold">
                          ¡Turno reservado! <span className="ml-2 text-white text-xl">{turnoReservado}</span>
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow p-8 border border-orange-100 dark:border-orange-700 min-h-[320px]">
                    <span className="material-icons text-7xl text-orange-200 mb-2">person_search</span>
                    <div className="text-lg text-gray-400 text-center">Escanea o ingresa un código para mostrar la información del estudiante</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Asistencia y exportar */}
        <section className="col-span-1 flex flex-col gap-6">
          {/* Exportar datos */}
          <div className="bg-white/90 dark:bg-gray-900/80 rounded-3xl shadow-xl p-6 border border-orange-200 dark:border-orange-400 flex flex-col gap-3">
            <h2 className="text-lg font-bold text-orange-600 mb-2 flex items-center gap-2">
              <span className="material-icons text-orange-400">download</span>
              Exportar Datos
            </h2>
            <button
              onClick={handleExport}
              disabled={registrosHoy.length === 0}
              className={`w-full py-3 px-4 ${registrosHoy.length === 0 ? 'bg-gray-300 text-gray-500' : 'bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white'} font-bold rounded-xl shadow-md hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg`}
            >
              Descargar CSV
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-200 text-center">{registrosHoy.length} registros disponibles</span>
          </div>
          {/* Asistencia de hoy */}
          <div className="bg-white/90 dark:bg-gray-900/80 rounded-3xl shadow-xl p-6 border border-orange-200 dark:border-orange-400 flex flex-col gap-3">
            <h2 className="text-lg font-bold text-orange-600 mb-2 flex items-center gap-2">
              <span className="material-icons text-orange-400">groups</span>
              Asistencia de Hoy
            </h2>
            {registrosHoy.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <span className="material-icons text-5xl mb-2">person_off</span>
                No hay registros hoy
              </div>
            ) : (
              <ul className="divide-y divide-orange-100 dark:divide-orange-900 max-h-72 overflow-y-auto">
                {registrosHoy.map((r, i) => (
                  <li key={i} className="py-2 flex items-center gap-3 flex-wrap">
                    <span className="material-icons text-orange-400">person</span>
                    <span className="font-mono text-base text-gray-800 dark:text-gray-100">{r.codigo}</span>
                    <span className="text-gray-700 dark:text-gray-200 flex-1">{r.nombre}</span>
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 mr-1">{r.carrera}</span>
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 mr-1">{r.turno}</span>
                    <span className="text-xs text-orange-600 font-bold">{r.hora}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
} 