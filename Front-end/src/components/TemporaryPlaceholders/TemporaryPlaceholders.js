import React from 'react';
import './TemporaryPlaceholders.scss';

export const PlaceholderForms = () => {
    return (
        <div className="placeholder">
            <h2>List of all forms *</h2>
            <p>A list of all available forms with search and sorting functionality.</p>
            <div className="placeholder__information">* - This feature is in progress.</div>
        </div>
    );
};

export const PlaceholderProfile = () => {
    return (
        <div className="placeholder">
            <h2>User profile *</h2>
            <p>User profile with all information.</p>
            <div className="placeholder__information">* - This feature is in progress.</div>
        </div>
    );
};

export const PlaceholderQuestions = () => {
    return (
        <div className="placeholder">
            <h2>List of all questions *</h2>
            <p>A list of all available questions with search and sorting functionality.</p>
            <div className="placeholder__information">* - This feature is in progress.</div>
        </div>
    );
};
