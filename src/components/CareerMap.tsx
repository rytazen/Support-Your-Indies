import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { 
  Compass, 
  Cpu, 
  Sparkles, 
  TrendingUp, 
  Briefcase, 
  Building2, 
  ArrowRight,
  Layers,
  Gamepad2,
  PieChart as PieIcon,
  ShieldCheck
} from 'lucide-react';
import { JobOpening, Discipline, GameEngine } from '../types';

interface CareerMapProps {
  jobs: JobOpening[];
  onExploreFilter: (type: 'discipline' | 'engine', value: string) => void;
}

const ENGINE_COLORS: Record<string, string> = {
  'Godot': '#478CBF',
  'Unreal Engine 5': '#A855F7',
  'Unity': '#22C55E',
  'GameMaker': '#10B981',
  'Custom C++ / Rust': '#F97316',
  'Bevy': '#F59E0B',
  'Other': '#64748B'
};

const DISCIPLINE_COLORS = [
  '#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B',
  '#06B6D4', '#E11D48', '#84CC16', '#6366F1', '#14B8A6'
];

export const CareerMap: React.FC<CareerMapProps> = ({
  jobs,
  onExploreFilter,
}) => {
  const [activeChartMode, setActiveChartMode] = useState<'radar' | 'pie' | 'cross'>('radar');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // 1. Discipline Distribution Data (for Radar & Bar Charts)
  const disciplineData = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach(j => {
      // Shorten discipline names slightly for clean radar display
      const shortName = j.discipline
        .replace(' & Animation', '')
        .replace(' & Shaders', '')
        .replace(' & Systems', '')
        .replace(' & Writing', '')
        .replace(' & Graphics', '')
        .replace(' (FMOD/Wwise)', '')
        .replace(' & Playtesting', '');
      counts[shortName] = (counts[shortName] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      discipline: name,
      fullName: jobs.find(j => j.discipline.startsWith(name))?.discipline || name,
      openings: count,
      fullMark: Math.max(...Object.values(counts)) + 2
    })).sort((a, b) => b.openings - a.openings);
  }, [jobs]);

  // 2. Engine Distribution Data (for Pie & Radar Charts)
  const engineData = useMemo(() => {
    const counts: Record<string, number> = {};
    jobs.forEach(j => {
      counts[j.engine] = (counts[j.engine] || 0) + 1;
    });

    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: count,
      color: ENGINE_COLORS[name] || '#8B5CF6'
    })).sort((a, b) => b.value - a.value);
  }, [jobs]);

  // 3. Engine Breakdown by Discipline (Cross-matrix for Stacked Bar)
  const crossMatrixData = useMemo(() => {
    const topEngines = ['Godot', 'Unreal Engine 5', 'Unity', 'Custom C++ / Rust'];
    const dataByEngine: Record<string, { engine: string; Programming: number; Art: number; Design: number; AudioAndOther: number }> = {};

    topEngines.forEach(eng => {
      dataByEngine[eng] = { engine: eng, Programming: 0, Art: 0, Design: 0, AudioAndOther: 0 };
    });

    jobs.forEach(j => {
      const eng = topEngines.includes(j.engine) ? j.engine : 'Other';
      if (!dataByEngine[eng]) {
        dataByEngine[eng] = { engine: eng, Programming: 0, Art: 0, Design: 0, AudioAndOther: 0 };
      }

      if (j.discipline.includes('Programming') || j.discipline.includes('Engine')) {
        dataByEngine[eng].Programming += 1;
      } else if (j.discipline.includes('Art') || j.discipline.includes('UI/UX')) {
        dataByEngine[eng].Art += 1;
      } else if (j.discipline.includes('Design') || j.discipline.includes('Narrative')) {
        dataByEngine[eng].Design += 1;
      } else {
        dataByEngine[eng].AudioAndOther += 1;
      }
    });

    return Object.values(dataByEngine);
  }, [jobs]);

  // Summary Metrics
  const topEngine = engineData[0]?.name || 'N/A';
  const topDiscipline = disciplineData[0]?.fullName || 'N/A';
  const remotePercentage = Math.round(
    (jobs.filter(j => j.workArrangement === 'Remote' || j.workArrangement === 'Flexible').length / (jobs.length || 1)) * 100
  );

  return (
    <div className="space-y-6">
      {/* Top Banner Ticker */}
      <div className="bg-gradient-to-r from-violet-950/70 via-slate-900 to-indigo-950/70 border border-violet-800/40 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Compass className="w-5 h-5 text-violet-400" />
              <h2 className="text-xl font-black text-white tracking-tight">
                Indie Game Dev Career Map & Market Pulse
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Visualize where indie game studios are investing their hiring budgets. Analyze hiring density across game engines and skill disciplines to discover high-demand specializations.
            </p>
          </div>

          {/* Quick Stat Pill Highlights */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0">
            <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Top Engine</span>
              <strong className="text-xs font-bold text-violet-300 block truncate mt-0.5">{topEngine}</strong>
            </div>

            <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Top Discipline</span>
              <strong className="text-xs font-bold text-emerald-300 block truncate mt-0.5">{disciplineData[0]?.discipline || 'Art'}</strong>
            </div>

            <div className="p-3 bg-slate-950/90 rounded-xl border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block font-medium">Remote Share</span>
              <strong className="text-xs font-bold text-cyan-300 block mt-0.5">{remotePercentage}%</strong>
            </div>
          </div>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center justify-between flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveChartMode('radar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeChartMode === 'radar'
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/40'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Skill Discipline Radar</span>
            </button>

            <button
              onClick={() => setActiveChartMode('pie')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeChartMode === 'pie'
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/40'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Engine Share (Pie)</span>
            </button>

            <button
              onClick={() => setActiveChartMode('cross')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeChartMode === 'cross'
                  ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/40'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Engine × Pillar Breakdown</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500">
            Click on any chart segment or tag to jump straight to filtered job listings.
          </span>
        </div>
      </div>

      {/* Main Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Primary Chart Area (7 or 8 columns on large screens) */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {activeChartMode === 'radar' && 'Game Dev Discipline Radar Distribution'}
                {activeChartMode === 'pie' && 'Indie Studio Game Engine Market Share'}
                {activeChartMode === 'cross' && 'Engine Stack vs Core Game Development Pillars'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeChartMode === 'radar' && 'Visualizing the spread of open vacancies across specialized game production roles.'}
                {activeChartMode === 'pie' && 'Proportion of indie openings requiring specific engines (Godot, Unreal, Unity, etc.)'}
                {activeChartMode === 'cross' && 'Distribution of Programming, Art, Design, and Audio across key engines.'}
              </p>
            </div>
          </div>

          {/* CHART CONTAINER */}
          <div className="h-80 sm:h-96 w-full flex items-center justify-center">
            {activeChartMode === 'radar' && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={disciplineData} outerRadius="75%">
                  <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="discipline" 
                    tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 500 }} 
                  />
                  <PolarRadiusAxis 
                    stroke="#475569" 
                    tick={{ fill: '#64748B', fontSize: 10 }} 
                    angle={30} 
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950 border border-violet-500/50 p-2.5 rounded-xl text-xs shadow-xl">
                            <p className="font-bold text-white">{data.fullName}</p>
                            <p className="text-violet-400 mt-0.5">
                              Active Openings: <strong>{data.openings}</strong>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Radar
                    name="Openings"
                    dataKey="openings"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.45}
                    activeDot={{ r: 6, fill: '#C084FC', stroke: '#fff', strokeWidth: 2 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}

            {activeChartMode === 'pie' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0];
                        const percentage = Math.round(((item.value as number) / jobs.length) * 100);
                        return (
                          <div className="bg-slate-950 border border-slate-700 p-2.5 rounded-xl text-xs shadow-xl">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.color }} />
                              <strong className="text-white">{item.name}</strong>
                            </div>
                            <p className="text-slate-300 mt-1">
                              {item.value} openings ({percentage}% of all positions)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(val) => <span className="text-xs text-slate-300 font-medium">{val}</span>}
                  />
                  <Pie
                    data={engineData}
                    cx="50%"
                    cy="45%"
                    innerRadius={65}
                    outerRadius={105}
                    paddingAngle={4}
                    dataKey="value"
                    onClick={(data) => {
                      if (data?.name) {
                        onExploreFilter('engine', data.name);
                      }
                    }}
                    cursor="pointer"
                  >
                    {engineData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke="#0f172a" 
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            )}

            {activeChartMode === 'cross' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={crossMatrixData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="engine" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Legend 
                    formatter={(val) => <span className="text-xs text-slate-300">{val}</span>} 
                  />
                  <Bar dataKey="Programming" stackId="a" fill="#8B5CF6" />
                  <Bar dataKey="Art" stackId="a" fill="#EC4899" />
                  <Bar dataKey="Design" stackId="a" fill="#3B82F6" />
                  <Bar dataKey="AudioAndOther" stackId="a" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Breakdown List & Direct Filter CTA (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Engine Breakdown Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-violet-400" />
                Top Engines In Demand
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Openings</span>
            </h4>

            <div className="space-y-2">
              {engineData.map(eng => {
                const percent = Math.round((eng.value / jobs.length) * 100);
                return (
                  <div
                    key={eng.name}
                    onClick={() => onExploreFilter('engine', eng.name)}
                    className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800/80 hover:border-violet-500/40 cursor-pointer transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: eng.color }} />
                      <div>
                        <span className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">
                          {eng.name}
                        </span>
                        <div className="w-24 sm:w-28 bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%`, backgroundColor: eng.color }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-200">{eng.value}</span>
                      <span className="text-[10px] text-slate-500 block">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top In-Demand Disciplines Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Key Hiring Disciplines
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Roles</span>
            </h4>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
              {disciplineData.map((disc, idx) => (
                <div
                  key={disc.discipline}
                  onClick={() => onExploreFilter('discipline', disc.fullName)}
                  className="p-2 rounded-lg bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-violet-500/40 cursor-pointer transition-all flex items-center justify-between text-xs group"
                >
                  <span className="text-slate-300 group-hover:text-violet-300 font-medium truncate max-w-[180px]">
                    {disc.fullName}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-violet-950/60 text-violet-300 text-[11px] font-mono border border-violet-800/40">
                    {disc.openings}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
