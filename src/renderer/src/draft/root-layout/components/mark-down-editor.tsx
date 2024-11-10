import { FC, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Box } from '@mui/material'

export const MarkdownEditor: FC<{
  value: string
  placeholder: string
  updateTaskValue: (taskId: number, newValue: string, segmentIndex?: number) => void
  id: number
  activeStepIndex: number
}> = ({ value, updateTaskValue, id, activeStepIndex }) => {
  const [isEditable, setIsEditable] = useState(false)

  return (
    <Box>
      {isEditable ? (
        <textarea
          value={value}
          onChange={(e) => updateTaskValue(id, e.target.value, activeStepIndex)}
          placeholder="Write your markdown here..."
          rows={10}
          style={{ width: '100%', padding: '8px' }}
          onBlur={() => setIsEditable(false)}
        />
      ) : (
        <Box
          tabIndex={1}
          onFocus={() => setIsEditable(true)}
          width={'100%'}
          sx={{ border: `1px solid ${value ? 'transparent' : 'silver'}`, minHeight: '20px' }}
        >
          <ReactMarkdown children={value} remarkPlugins={[remarkGfm]} />
        </Box>
      )}
    </Box>
  )
}
