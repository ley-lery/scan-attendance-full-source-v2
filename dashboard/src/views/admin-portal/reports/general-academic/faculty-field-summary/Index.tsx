import { MetricCard } from "@/components/ui"

const muckData = [
  {
    title: "Total Faculties",
    value: 3,
    icon: "",
    variant: "primary",
    type: 'Faculties'
  },
  {
    title: "Total Fields",
    value: 3,
    icon: "",
    variant: "primary",
    type: 'Fields'
    
  },
  {
    title: "Active Faculties",
    value: 3,
    icon: "",
    variant: "success",
    type: 'Faculties'
  },
  {
    title: "Active Fields",
    value: 3,
    icon: "",
    variant: "success",
    type: 'Fields'
  },
  {
    title: "Inactive Faculties",
    value: 0,
    icon: "",
    variant: "danger",
    type: 'Faculties'
  },
  {
    title: "Inactive Fields",
    value: 1,
    icon: "",
    variant: "danger",
    type: 'Fields'
  },
]

const Index = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-200">Faculty Field Summary Report</h2>
      <p className="text-zinc-500 dark:text-zinc-400">This report shows the summary of the faculties fields</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-10">
        {muckData.map((item, index) => (
          <MetricCard 
            key={index} 
            title={item.title} 
            value={item.value} 
            icon={item.icon} 
            variant={item.variant as any} 
            type={item.type}
            showProgress={false}
            showChart
            colorChart={item.variant}
            classNames={{base: "bg-zinc-50 dark:bg-zinc-800 shadow-lg shadow-zinc-200/50 dark:shadow-black/20"}}/>
        ))}
      </div>
    </div>
  )
}

export default Index