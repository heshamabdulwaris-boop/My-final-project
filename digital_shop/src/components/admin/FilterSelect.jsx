export function FilterSelect({ value, onChange, options, placeholder = 'Filter...' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-200/50 dark:border-gray-700/50 rounded-xl bg-white/50 dark:bg-gray-900/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[rgb(54,3,222)]/20 focus:border-[rgb(54,3,222)]/50 text-sm transition-all duration-200 appearance-none cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
