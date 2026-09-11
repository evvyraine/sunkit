import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils'

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ScrollAreaOrientation
  /** Softly fade the content into the top and bottom edges. */
  fade?: boolean
  /** Class applied to the scrolling viewport (the element with `overflow`). */
  viewportClassName?: string
  children?: ReactNode
}

const OVERFLOW: Record<ScrollAreaOrientation, string> = {
  vertical: 'overflow-x-hidden overflow-y-auto',
  horizontal: 'overflow-x-auto overflow-y-hidden',
  both: 'overflow-auto',
}

/**
 * A thin, toned scroll container. `forwardRef` targets the viewport so callers can
 * read `scrollTop` or drive scroll-into-view.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { orientation = 'vertical', fade = false, viewportClassName, className, children, ...rest },
  ref,
) {
  return (
    <div className={cn('relative min-h-0 min-w-0', className)} {...rest}>
      <div
        ref={ref}
        className={cn(
          'sk-scrollbar h-full w-full overscroll-contain',
          OVERFLOW[orientation],
          fade && 'sk-scroll-fade',
          viewportClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
})
