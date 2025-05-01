// src/components/VoteButton.jsx
import React from 'react';

/**
 * VoteButton — кнопка-треугольник вверх.
 * @param {{ voted: boolean, onClick: ()=>void }} props
 */
export default function VoteButton({ voted, onClick }) {
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-block',
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderBottom: voted ? '12px solid #ff6600' : '12px solid #ccc',
        cursor: 'pointer',
        marginRight: '8px'
      }}
      title={voted ? 'Unvote' : 'Vote'}
    ></span>
  );
}
