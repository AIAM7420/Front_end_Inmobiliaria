export type ChartViewMode = 'dias' | 'semanas' | 'meses';

export const generateChartData = (period: string, viewMode: ChartViewMode) => {
  const data = [];
  const isMeses = viewMode === 'meses';
  const isSemanas = viewMode === 'semanas';
  
  // Stable pseudo-random generator based on index to prevent flickering on re-renders
  const generatePoint = (i: number, base: number, variance: number) => {
    const sine = Math.sin(i * 0.5) + Math.sin(i * 0.1);
    const normalized = (sine + 2) / 4; // Approx 0 to 1
    return Math.floor(base + normalized * variance);
  };

  if (period === 'Semana') {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    return days.map((day, i) => ({ 
      label: day, 
      traffic: generatePoint(i, 4000, 5000), 
      conversion: generatePoint(i, 35, 15),
      views: generatePoint(i, 400, 500)
    }));
  }

  if (period === 'Mes') {
    for (let i = 1; i <= 30; i++) {
      data.push({ 
        label: i.toString(), 
        traffic: generatePoint(i, 1000, 2500), 
        conversion: generatePoint(i, 30, 20),
        views: generatePoint(i, 100, 250)
      });
    }
    return data;
  }

  if (period === '3 Meses') {
    if (isMeses) {
      const months = ['Mes 1', 'Mes 2', 'Mes 3'];
      return months.map((m, i) => ({ 
        label: m, 
        traffic: generatePoint(i, 30000, 15000), 
        conversion: generatePoint(i, 35, 10),
        views: generatePoint(i, 3000, 1500)
      }));
    } else if (isSemanas) {
      for (let i = 1; i <= 12; i++) {
        data.push({ 
          label: `Sem ${i}`, 
          traffic: generatePoint(i, 7000, 4000), 
          conversion: generatePoint(i, 32, 15),
          views: generatePoint(i, 700, 400)
        });
      }
      return data;
    } else {
      for (let i = 1; i <= 90; i++) {
        data.push({ 
          label: i.toString(), 
          traffic: generatePoint(i, 1000, 2500), 
          conversion: generatePoint(i, 30, 20),
          views: generatePoint(i, 100, 250)
        });
      }
      return data;
    }
  }

  if (period === '6 Meses') {
    if (isMeses) {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
      return months.map((m, i) => ({ 
        label: m, 
        traffic: generatePoint(i, 30000, 15000), 
        conversion: generatePoint(i, 35, 10),
        views: generatePoint(i, 3000, 1500)
      }));
    } else if (isSemanas) {
      for (let i = 1; i <= 26; i++) {
        data.push({ 
          label: `Sem ${i}`, 
          traffic: generatePoint(i, 7000, 4000), 
          conversion: generatePoint(i, 32, 15),
          views: generatePoint(i, 700, 400)
        });
      }
      return data;
    } else {
      for (let i = 1; i <= 180; i++) {
        data.push({ 
          label: i.toString(), 
          traffic: generatePoint(i, 1000, 2500), 
          conversion: generatePoint(i, 30, 20),
          views: generatePoint(i, 100, 250)
        });
      }
      return data;
    }
  }

  if (period === 'Año') {
    if (isMeses) {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      return months.map((m, i) => ({ 
        label: m, 
        traffic: generatePoint(i, 30000, 15000), 
        conversion: generatePoint(i, 35, 10),
        views: generatePoint(i, 3000, 1500)
      }));
    } else if (isSemanas) {
      for (let i = 1; i <= 52; i++) {
        data.push({ 
          label: `Sem ${i}`, 
          traffic: generatePoint(i, 7000, 4000), 
          conversion: generatePoint(i, 32, 15),
          views: generatePoint(i, 700, 400)
        });
      }
      return data;
    } else {
      for (let i = 1; i <= 365; i++) {
        data.push({ 
          label: i.toString(), 
          traffic: generatePoint(i, 1000, 2500), 
          conversion: generatePoint(i, 30, 20),
          views: generatePoint(i, 100, 250)
        });
      }
      return data;
    }
  }

  return [];
};
