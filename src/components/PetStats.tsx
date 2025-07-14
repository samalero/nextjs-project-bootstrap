'use client';

import React from 'react';
import { PetStats as PetStatsType } from '@/hooks/usePet';

interface PetStatsProps {
  stats: PetStatsType;
  message: string;
}

const PetStats: React.FC<PetStatsProps> = ({ stats, message }) => {
  return (
    <div className="p-4 bg-card rounded-lg shadow-md mt-4 text-center">
      <h2 className="text-xl font-semibold mb-4">Estadísticas de la Mascota</h2>
      <div className="grid grid-cols-3 gap-6 mb-4">
        <div>
          <span className="block font-medium text-primary">Felicidad</span>
          <span className="text-2xl">{stats.felicidad}</span>
        </div>
        <div>
          <span className="block font-medium text-secondary">Energía</span>
          <span className="text-2xl">{stats.energia}</span>
        </div>
        <div>
          <span className="block font-medium text-accent">Salud</span>
          <span className="text-2xl">{stats.salud}</span>
        </div>
      </div>
      <p className="italic text-muted-foreground">{message}</p>
    </div>
  );
};

export default PetStats;
