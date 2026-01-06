// Mock data helpers to keep UI wired while the real API is prepared.
// Swap these implementations with real API calls later without touching the UI.

export const getDoctorExercises = (doctorId = 'doctor-1', childId = 'child-1') => {
  const summary = {
    doctorId,
    childId,
    completed: 12,
    toComplete: 8,
    progressPercent: 60,
  };

  const list = [
    {
      id: 'ex-1',
      title: 'Sound Practice: "S" Sound',
      category: 'Articulation',
      level: 'Easy',
      duration: '10 min',
      cta: 'Start Exercise',
      status: 'new',
      image:
        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 'ex-2',
      title: 'Picture Naming Game',
      category: 'Vocabulary',
      level: 'Medium',
      duration: '15 min',
      cta: 'Practice Again',
      status: 'completed',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  return { summary, list };
};

export const getDoctorProgress = (doctorId = 'doctor-1', childId = 'child-1') => {
  const performanceTrend = [
    { label: 'Aug', value: 45 },
    { label: 'Sep', value: 52 },
    { label: 'Oct', value: 58 },
    { label: 'Nov', value: 64 },
    { label: 'Dec', value: 69 },
    { label: 'Jan', value: 78 },
  ];

  const stats = {
    doctorId,
    childId,
    exercisesCompleted: 15,
    sessionsAttended: 8,
  };

  const recentReports = [
    { id: 'r1', title: 'Monthly Progress Report', date: 'Jan 1, 2026' },
    { id: 'r2', title: 'Monthly Progress Report', date: 'Jan 2, 2026' },
    { id: 'r3', title: 'Monthly Progress Report', date: 'Jan 3, 2026' },
  ];

  return { performanceTrend, stats, recentReports };
};


