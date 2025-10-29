import { Progress, Spinner } from '@heroui/react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
        <Spinner variant='spinner' size='sm' color='primary'/>
        <Progress isIndeterminate aria-label="Loading..." className="min-w-32 max-w-32" size="sm" />
    </div>
  )
}

export default Loading