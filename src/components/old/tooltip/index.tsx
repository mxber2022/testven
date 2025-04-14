/** @jsxImportSource theme-ui */
import { ReactNode, useCallback, useState } from 'react'
import { Box } from 'theme-ui'

import Popover, { PopoverProps } from '../popover'

interface TooltipProps extends Omit<PopoverProps, 'content'> {
  text: ReactNode
  disableHover?: boolean // disable the hover and content display
  onClose?: () => void
}

interface TooltipContentProps extends Omit<PopoverProps, 'content'> {
  content: ReactNode
  onOpen?: () => void
  // whether to wrap the content in a `TooltipContainer`
  wrap?: boolean
  disableHover?: boolean // disable the hover and content display
}

const TooltipBox = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      maxWidth: '480px',
      padding: '1rem 1.2rem',
      fontWeight: 400,
      wordBreak: 'break-word',
      color: 'var(--theme-ui-colors-text)',
      backgroundColor: '#171720', // Match Venice Fi dark theme
      border: '1px solid #2a2a35', // Slightly lighter border for contrast
      boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.4)', // Stronger shadow for visibility
      borderRadius: '12px',
      zIndex: 100010, // Ensure it's above other elements
      fontSize: '14px',
      minWidth: '300px', // Ensure sufficient width for content
    }}
  >
    {children}
  </Box>
)

export default function Tooltip({ text, ...rest }: TooltipProps) {
  return <Popover content={text && <TooltipBox>{text}</TooltipBox>} {...rest} />
}

function TooltipContent({
  content,
  wrap = false,
  ...rest
}: TooltipContentProps) {
  return (
    <Popover
      content={wrap ? <TooltipBox>{content}</TooltipBox> : content}
      {...rest}
    />
  )
}

/** Standard text tooltip. */
export function MouseoverTooltip({
  text,
  disableHover,
  onClose: closeCallback = undefined,
  children,
  ...rest
}: Omit<TooltipProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => {
    setShow(true)
    closeCallback?.()
  }, [setShow])
  const close = useCallback(() => {
    setShow(false)
  }, [setShow, closeCallback])
  return (
    <Tooltip {...rest} show={show} text={disableHover ? null : text}>
      <div onMouseEnter={open} onMouseLeave={close}>
        {children}
      </div>
    </Tooltip>
  )
}

/** Tooltip that displays custom content. */
export function MouseoverTooltipContent({
  content,
  children,
  onOpen: openCallback = undefined,
  disableHover,
  ...rest
}: Omit<TooltipContentProps, 'show'>) {
  const [show, setShow] = useState(false)
  const open = useCallback(() => {
    setShow(true)
    openCallback?.()
  }, [openCallback])
  const close = useCallback(() => setShow(false), [setShow])
  return (
    <TooltipContent
      {...rest}
      show={show}
      content={disableHover ? null : content}
    >
      <div
        style={{ 
          display: 'inline-block', 
          lineHeight: 0, 
          padding: '0.25rem',
          position: 'relative', // Ensure proper positioning
          cursor: 'pointer' 
        }}
        onMouseEnter={open}
        onMouseLeave={close}
      >
        {children}
      </div>
    </TooltipContent>
  )
}
