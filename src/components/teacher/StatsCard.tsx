import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  color: 'gray' | 'yellow' | 'green' | 'red';
}

const colorMap = {
  gray:   { bg: 'bg-gray-100',   text: 'text-gray-600',   value: 'text-gray-900' },
  yellow: { bg: 'bg-yellow-50',  text: 'text-yellow-600', value: 'text-yellow-700' },
  green:  { bg: 'bg-green-50',   text: 'text-green-600',  value: 'text-green-700' },
  red:    { bg: 'bg-red-50',     text: 'text-red-600',    value: 'text-red-700' },
};

export default function StatsCard({ label, value, icon: Icon, color }: StatsCardProps) {
  const c = colorMap[color];
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`${c.bg} p-3 rounded-lg`}>
        <Icon size={20} className={c.text} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-2xl font-bold ${c.value}`}>{value}</p>
      </div>
    </div>
  );
}