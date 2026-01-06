import React, { useMemo } from 'react';
import './ProgressPage.css';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { FaChartLine, FaMedal, FaCalendarCheck } from 'react-icons/fa';

const ProgressPage = ({ data, onBack }) => {
  const { performanceTrend = [], stats = {}, recentReports = [] } = data || {};

  const chartDimensions = { width: 100, height: 80, padding: 10 };

  const chartPoints = useMemo(() => {
    if (!performanceTrend.length) return '';
    const values = performanceTrend.map((p) => p.value);
    const max = Math.max(...values, 1);
    const min = Math.min(...values, 0);
    const range = max - min || 1;
    const stepX =
      performanceTrend.length > 1
        ? (chartDimensions.width - chartDimensions.padding * 2) /
          (performanceTrend.length - 1)
        : 0;

    return performanceTrend
      .map((point, idx) => {
        const x = chartDimensions.padding + idx * stepX;
        const normalized = (point.value - min) / range;
        const y =
          chartDimensions.height - chartDimensions.padding - normalized * (chartDimensions.height - chartDimensions.padding * 2);
        return `${x},${y}`;
      })
      .join(' ');
  }, [performanceTrend, chartDimensions.height, chartDimensions.padding, chartDimensions.width]);

  return (
    <div className="progress-page">
      <div className="progress-header">
        <button className="back-button" onClick={onBack}>
          <IoMdArrowRoundBack />
        </button>
        <h2>Progress & Reports</h2>
      </div>

      <div className="progress-card trend-card">
        <div className="card-title">
          <FaChartLine /> <span>Performance Trend</span>
        </div>
        {performanceTrend.length ? (
          <div className="chart-wrapper">
            <svg viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`} preserveAspectRatio="none">
              <polyline points={chartPoints} fill="none" stroke="#5f9bff" strokeWidth="2" />
              {performanceTrend.map((point, idx) => {
                const pointsArray = chartPoints.split(' ');
                const [x, y] = pointsArray[idx]?.split(',') || [0, 0];
                return (
                  <g key={point.label}>
                    <circle cx={x} cy={y} r="1.5"  fill="#558be5" />
                  </g>
                );
              })}
            </svg>
            <div className="chart-labels">
              {performanceTrend.map((point) => (
                <span key={point.label}>{point.label}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-chart">No performance data yet</div>
        )}
      </div>

      <div className="stats-grid">
        <div className="progress-card stat-card">
          <div className="stat-icon medal">
            <FaMedal />
          </div>
          <div className="stat-value">{stats.exercisesCompleted ?? 0}</div>
          <div className="stat-label">Exercises Completed</div>
        </div>
        <div className="progress-card stat-card">
          <div className="stat-icon calendar">
            <FaCalendarCheck />
          </div>
          <div className="stat-value">{stats.sessionsAttended ?? 0}</div>
          <div className="stat-label">Sessions Attended</div>
        </div>
      </div>

      <div className="progress-card reports-card">
        <div className="card-title">
          <span>Recent Reports</span>
        </div>
        <div className="reports-list">
          {recentReports.length ? (
            recentReports.map((report) => (
              <div key={report.id} className="report-item">
                <div className="report-icon">📄</div>
                <div className="report-info">
                  <div className="report-title">{report.title}</div>
                  <div className="report-date">{report.date}</div>
                </div>
                <button className="report-link">View</button>
              </div>
            ))
          ) : (
            <div className="empty-reports">No reports yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;

