import React from 'react';

const QuotaMeter = ({ energy, limitReached }) => {
    return (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-xl glass-panel shadow-lg border border-white/10 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="text-sm font-medium text-white/90">Daily AI Energy</div>
                <div className="text-sm font-bold text-accent-cyan">{energy}%</div>
            </div>
            <div className="w-48 h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ease-out ${limitReached ? 'bg-red-500' : 'bg-gradient-to-r from-accent-purple to-accent-cyan'}`}
                    style={{ width: `${energy}%` }}
                />
            </div>
            {limitReached && (
                <div className="absolute top-full right-0 mt-2 p-3 bg-red-500/10 border border-red-500/20 text-red-200 text-xs rounded-lg backdrop-blur-md w-64">
                    The AI is resting! We've hit our daily free limit. Come back tomorrow at 1:30 PM IST when it resets.
                </div>
            )}
        </div>
    );
};

export default QuotaMeter;
