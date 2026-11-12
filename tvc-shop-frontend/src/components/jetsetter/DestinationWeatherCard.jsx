import React from 'react';

const DestinationWeatherCard = ({ destKey, data, isSelected, onSelect }) => {
    const weather = data.current_weather;
    const isCold = weather.temp_c <= 10;
    const isWarm = weather.temp_c >= 20;

    return (
        <div 
            onClick={() => onSelect(destKey)}
            className={`p-6 border cursor-pointer transition-all duration-500 flex flex-col justify-between ${
                isSelected 
                    ? 'border-white bg-zinc-950 shadow-2xl ring-1 ring-white/20' 
                    : 'border-zinc-800/80 bg-zinc-950/40 hover:border-zinc-700'
            }`}
        >
            <div>
                {/* Header City & Country */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                        {data.country}
                    </span>
                    <span className={`text-[10px] uppercase font-mono px-2 py-0.5 border ${
                        isCold ? 'border-cyan-500/30 text-cyan-400 bg-cyan-950/20' 
                        : isWarm ? 'border-amber-500/30 text-amber-400 bg-amber-950/20'
                        : 'border-zinc-500/30 text-zinc-300'
                    }`}>
                        {weather.season_category.replace('_', ' ')}
                    </span>
                </div>

                <h3 className="text-2xl font-serif text-white tracking-wide mb-1">
                    {data.city}
                </h3>
                <p className="text-xs text-zinc-400 font-light italic leading-relaxed mb-4">
                    "{data.vibe}"
                </p>

                {/* Weather Matrix Box */}
                <div className="p-4 bg-black/60 border border-zinc-900 rounded-sm mb-4">
                    <div className="flex items-baseline justify-between mb-2">
                        <span className="text-3xl font-serif font-bold text-white tracking-tight">
                            {weather.temp_c}°C
                        </span>
                        <span className="text-xs font-light text-zinc-300">
                            {weather.condition}
                        </span>
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-zinc-900">
                        <span>Độ ẩm: {weather.humidity}%</span>
                        <span>Sức gió: {weather.wind_kmh} km/h</span>
                    </div>
                </div>

                {/* Curated Capsule Title */}
                <div>
                    <span className="text-[9px] uppercase tracking-widest text-zinc-500 block mb-1">
                        Capsule Wardrobe Đề Xuất:
                    </span>
                    <h4 className="text-xs font-medium text-amber-300 mb-2">{data.curated_capsule.title}</h4>
                    <ul className="text-[11px] text-zinc-400 space-y-1 list-disc list-inside font-light">
                        {data.curated_capsule.essential_pieces.slice(0, 2).map((piece, idx) => (
                            <li key={idx} className="line-clamp-1">{piece}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom button */}
            <div className="mt-6 pt-3 border-t border-zinc-900">
                <button
                    className={`w-full py-2.5 uppercase tracking-[0.2em] text-[10px] font-medium transition-all ${
                        isSelected 
                            ? 'bg-white text-black' 
                            : 'border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                >
                    {isSelected ? 'Đang kích hoạt điểm đến' : 'Xem Vali Phối Đồ Chi Tiết'}
                </button>
            </div>
        </div>
    );
};

export default DestinationWeatherCard;
