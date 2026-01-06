import React from 'react';
import './ExercisesPage.css';
import { IoMdArrowRoundBack } from 'react-icons/io';

const ExercisesPage = ({ data, onBack }) => {
  if (!data) return null;
  const { summary, list } = data;

  return (
    <div className="page-content exercises-page">
      <div className="simple-page-header">
        <button className="back-button" onClick={onBack}>
          <IoMdArrowRoundBack />
        </button>
        <h2>Speech Exercises</h2>
      </div>

      <div className="exercises-hero">
        <div>
          <h3>Exercises Completed</h3>
          <div className="hero-number">{summary.completed}</div>
        </div>
        <div>
          <h3>To Complete</h3>
          <div className="hero-number">{summary.toComplete}</div>
        </div>
        <div>
          <h3>Progress</h3>
          <div className="hero-number">{summary.progressPercent}%</div>
        </div>
      </div>

      <div className="exercises-list">
        {list.map((item) => (
          <div key={item.id} className="exercise-card">
            <div className="exercise-thumb" style={{ backgroundImage: `url(${item.image})` }} />
            <div className="exercise-body">
              <div className="exercise-header">
                <div>
                  <h3>{item.title}</h3>
                  <p className="exercise-category">{item.category}</p>
                </div>
                {item.status === 'completed' && <span className="exercise-status done">✓</span>}
              </div>
              <div className="exercise-tags">
                <span className="tag level">{item.level}</span>
                <span className="tag duration">⏱ {item.duration}</span>
              </div>
              <button className="primary-btn exercise-cta">{item.cta}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisesPage;


