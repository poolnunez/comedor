"use client";

import React, { useState } from 'react';

const turnos = [
  { id: 1, label: '12:00 a 12:30' },
  { id: 2, label: '12:30 a 1:00' },
  { id: 3, label: '1:00 a 1:30' },
  { id: 4, label: '1:30 a 2:00' },
];

export default function ReservaPage() {
  const [codigo, setCodigo] = useState('');
  const [dni, setDni] = useState('');
  const [logueado, setLogueado] = useState(false);
  const [perfil, setPerfil] = useState<any>(null);
  const [turnoSeleccionado, setTurnoSeleccionado] = useState<any>(null);
  const [yaReservo, setYaReservo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login real y consulta de reserva
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Login
      const res = await fetch("http://localhost:8080/api/reservas/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo, dni })
      });
      if (!res.ok) {
        setError("Código o DNI incorrecto");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setPerfil(data);
      setLogueado(true);
      // Consultar si ya reservó hoy
      const resReserva = await fetch(`http://localhost:8080/api/reservas/reserva-hoy/${codigo}`);
      if (resReserva.ok) {
        const reserva = await resReserva.json();
        if (reserva && reserva.turno) {
          setYaReservo(true);
          setTurnoSeleccionado(turnos.find(t => t.label === reserva.turno) || { label: reserva.turno });
      } else {
          setYaReservo(false);
          setTurnoSeleccionado(null);
        }
      }
    } catch (err) {
      setError("");
    } finally {
      setLoading(false);
    }
  };

  // Reservar turno
  const handleReservar = async (turno: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8080/api/reservas/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: perfil.codigo, turno: turno.label })
      });
      if (!res.ok) {
        const msg = await res.text();
        setError(msg || "No se pudo reservar el turno");
        setLoading(false);
        return;
      }
      setTurnoSeleccionado(turno);
      setYaReservo(true);
    } catch (err) {
      setError("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-400 via-orange-500 to-yellow-300">
      <div className="w-full max-w-md p-8 bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl backdrop-blur-md border border-orange-200 dark:border-orange-400 relative">
        <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-orange-400 to-yellow-500 mb-2 drop-shadow-lg tracking-tight">
          🍽️ Reserva 
        </h1>
        <div className="flex justify-center mb-6">
          <img src="https://www.unfv.edu.pe/images/logo_unfv_28julio.png" alt="Logo UNFV" className="h-28 w-auto" />
        </div>
        {!logueado ? (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Código"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-orange-300 dark:border-orange-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:text-white text-lg font-mono bg-white/80"
            />
            <input
              type="password"
              placeholder="DNI"
              value={dni}
              onChange={e => setDni(e.target.value)}
              required
              className="w-full px-4 py-2 border-2 border-orange-300 dark:border-orange-500 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 dark:bg-gray-800 dark:text-white text-lg font-mono bg-white/80"
            />
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 text-white font-bold rounded-xl shadow-md hover:from-orange-600 hover:to-yellow-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-lg"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
            {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
          </form>
        ) : (
          <div>
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-2">
                <img
                  src={perfil.foto}
                  alt="Foto del estudiante"
                  className="w-28 h-28 rounded-full object-cover border-4 border-orange-300 shadow-md bg-white"
                />
                <span className="absolute bottom-0 right-0 bg-green-400 border-2 border-white rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold shadow">✓</span>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-1">{perfil.nombres}</div>
                <div className="text-base text-gray-700 dark:text-gray-200 font-mono">{perfil.codigo}</div>
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 rounded-full text-xs font-semibold">{perfil.carrera}</span>
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 rounded-full text-xs font-semibold">{perfil.local}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-sm text-gray-800 dark:text-gray-100">
              <div className="flex items-center gap-2"><span className="material-icons text-orange-400">school</span><b>Facultad:</b> {perfil.facultad}</div>
              <div className="flex items-center gap-2"><span className="material-icons text-orange-400">badge</span><b>DNI:</b> {perfil.dni}</div>
              <div className="flex items-center gap-2"><span className="material-icons text-orange-400">apartment</span><b>Escuela:</b> {perfil.escuela}</div>
            </div>
            <h4 className="text-lg font-semibold mb-2 text-orange-600 dark:text-orange-200">Reserva de Turno</h4>
            {yaReservo ? (
              <div className="flex items-center justify-center p-4 bg-green-100 dark:bg-green-900 rounded-xl text-green-800 dark:text-green-200 font-bold text-center shadow-md gap-2">
                <span className="material-icons text-green-500 text-2xl">check_circle</span>
                ¡Turno reservado!<br />
                <span className="block text-lg font-semibold text-green-700 dark:text-green-100">{turnoSeleccionado.label}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {turnos.map(turno => (
                  <button
                    key={turno.id}
                    onClick={() => handleReservar(turno)}
                    className="py-2 px-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 text-white font-bold rounded-xl shadow-md hover:from-yellow-500 hover:to-orange-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 text-base"
                    disabled={loading}
                  >
                    Reservar {turno.label}
                  </button>
                ))}
                {error && <div className="text-red-600 text-center font-semibold">{error}</div>}
              </div>
            )}
          </div>
        )}
        <div className="absolute left-0 right-0 -bottom-8 flex justify-center">
          <span className="text-xs text-gray-400 dark:text-gray-500">Desarrollado por Equipo 3 - Fundamentos de Bases de Datos</span>
        </div>
      </div>
    </main>
  );
}
