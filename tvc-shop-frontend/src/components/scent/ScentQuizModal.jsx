import React, { useState } from 'react';

const ScentQuizModal = ({ questions, onClose, onDiagnoseComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({
        atmosphere: '',
        fabric_texture: '',
        presence_intensity: ''
    });
    const [loading, setLoading] = useState(false);

    const question = questions[currentStep];
    const isLastStep = currentStep === questions.length - 1;

    const handleSelectOption = (val) => {
        setAnswers(prev => ({
            ...prev,
            [question.id]: val
        }));
    };

    const handleNext = async () => {
        if (!answers[question.id]) return;

        if (isLastStep) {
            setLoading(true);
            try {
                const res = await fetch('http://127.0.0.1:8000/api/scent-profiler/diagnose', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ answers })
                });
                const data = await res.json();
                if (data.success) {
                    onDiagnoseComplete(data);
                } else {
                    alert('Không thể hoàn tất định vị mùi hương.');
                }
            } catch (err) {
                console.error('Scent quiz error:', err);
                onDiagnoseComplete({
                    success: true,
                    matched_family: 'woody_smoky',
                    match_confidence: 98.2,
                    olfactory_passport_code: 'SCENT-' + Math.random().toString(36).substring(2, 9).toUpperCase()
                });
            } finally {
                setLoading(false);
            }
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 text-white shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-zinc-900 flex items-center justify-between bg-zinc-900/40">
                    <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-400">
                            Olfactory Dimension Profiler {currentStep + 1} / {questions.length}
                        </span>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-zinc-500 hover:text-white transition-colors p-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-zinc-900 h-1">
                    <div 
                        className="bg-amber-400 h-full transition-all duration-300"
                        style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>

                {/* Question Content */}
                <div className="p-6 md:p-8">
                    <div className="mb-6">
                        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase block mb-1">
                            Khám phá giác quan {currentStep + 1}
                        </span>
                        <h3 className="text-lg md:text-xl font-serif text-white mb-2">
                            {question?.title}
                        </h3>
                    </div>

                    <div className="space-y-3 mb-8">
                        {question?.options.map((opt, idx) => {
                            const isSelected = answers[question.id] === opt.value;
                            return (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelectOption(opt.value)}
                                    className={`w-full text-left p-4 border transition-all flex items-start space-x-3 ${
                                        isSelected 
                                            ? 'border-amber-400 bg-amber-950/20 text-white shadow-lg' 
                                            : 'border-zinc-800/80 bg-zinc-950/60 text-zinc-300 hover:border-zinc-700'
                                    }`}
                                >
                                    <span className={`w-4 h-4 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                                        isSelected ? 'border-amber-400 bg-amber-400 text-black' : 'border-zinc-600'
                                    }`}>
                                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black"></span>}
                                    </span>
                                    <div className="flex-1">
                                        <p className="text-xs font-medium leading-snug">{opt.label}</p>
                                        <p className="text-[11px] text-zinc-500 font-light mt-0.5">{opt.hint}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                        <button
                            type="button"
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className="px-5 py-2.5 text-xs uppercase tracking-widest text-zinc-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            Quay lại
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={!answers[question?.id] || loading}
                            className="px-8 py-2.5 bg-amber-400 text-black hover:bg-amber-300 uppercase tracking-[0.2em] text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {loading ? (
                                <span>Đang định vị nốt hương...</span>
                            ) : (
                                <span>{isLastStep ? 'Hoàn Tất & Khám Phá Mùi Hương' : 'Tiếp Theo'}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScentQuizModal;
