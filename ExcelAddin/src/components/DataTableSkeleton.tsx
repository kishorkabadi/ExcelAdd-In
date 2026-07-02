import React from 'react'
import { Shimmer, ShimmerElementType } from '@fluentui/react'

const DataTableSkeleton: React.FC = () => (
  <div>
    {[...Array(5)].map((_, i) => (
      <Shimmer
        key={i}
        shimmerElements={[
          { type: ShimmerElementType.line, width: '100%', height: 20 },
        ]}
        style={{ marginBottom: 16 }}
      />
    ))}
  </div>
)

export default DataTableSkeleton
