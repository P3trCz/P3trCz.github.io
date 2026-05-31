// Koláčový graf podílu streamovacích služeb na celkovém čase sledování.
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { serviceColors, ServiceType } from '../../../data/catalog';
import { formatMinutes } from '../../../utils/formatUtils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ outline: 'none' }}
      />
    </g>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PieComponent = Pie as any;

type PieEntry = { name: string; value: number };

type ServicePieChartProps = {
  pieData: PieEntry[];
  rangeLabel: string;
};

export function ServicePieChart({ pieData, rangeLabel }: ServicePieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    setIsAnimating(true);
    setActiveIndex(undefined);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [pieData]);

  return (
    <div className="lg:col-span-2 panel-container-dark">
      <h2 className="text-lg font-medium text-white mb-6">
        Podíl služeb na čase sledování filmů {rangeLabel}
      </h2>

      <div className="h-80 w-full relative">
        {isAnimating && <div className="absolute inset-0 z-10" />}
        {!pieData.some(entry => entry.value > 0) ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#27272a] rounded-xl">
            <div className="w-12 h-12 rounded-full bg-[#1c1c24] flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                <path d="M22 12A10 10 0 0 0 12 2v10z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Žádná data za vybrané období</h3>
            <p className="text-sm text-gray-400 max-w-md">
              Za zvolené období nemáte zaznamenaná žádná data sledování filmů. Zkuste zvolit delší časové období nebo zhlédnout nějaký film.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <PieComponent
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_: unknown, index: number) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(undefined)}
                style={{ outline: 'none' }}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={serviceColors[entry.name as ServiceType] || '#8884d8'} />
                ))}
              </PieComponent>
              <Tooltip
                contentStyle={{ backgroundColor: '#1c1c24', borderColor: '#27272a', color: 'white', borderRadius: '8px' }}
                itemStyle={{ color: 'white' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: unknown, name: any) => [formatMinutes(Number(value)), String(name)]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-4">
        {pieData.filter(entry => entry.value > 0).map(entry => (
          <div key={entry.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: serviceColors[entry.name as ServiceType] }}></div>
            <span className="text-sm font-medium text-gray-400">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
