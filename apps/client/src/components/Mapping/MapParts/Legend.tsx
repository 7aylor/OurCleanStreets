export interface LegendItem {
  color: string;
  label: string;
}

interface MapLegendProps {
  title?: string;
  items: LegendItem[];
}

const Legend = ({ title, items }: MapLegendProps) => {
  return (
    <div
      className={`z-[500] absolute bottom-6 right-2 bg-white/90 backdrop-blur-md p-3 rounded-lg shadow text-sm`}
    >
      {title && (
        <h4 className='font-semibold mb-2 text-gray-900 text-center'>
          {title}
        </h4>
      )}
      <ul>
        {items.map((item) => (
          <li key={item.label} className='flex items-center gap-2'>
            <span
              className='inline-block w-3 h-3 rounded-sm'
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Legend;
