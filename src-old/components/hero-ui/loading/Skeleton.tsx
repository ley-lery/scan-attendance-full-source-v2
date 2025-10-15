import { Skeleton } from '@heroui/react'
import LoadingUi from './Loading'

const SkeletonUi = ({className}: {className?: string}) => {
  return (
    <Skeleton  className={`rounded-2xl p-4 ${className}`} >
        <LoadingUi/>
    </Skeleton>
  )
}

export default SkeletonUi