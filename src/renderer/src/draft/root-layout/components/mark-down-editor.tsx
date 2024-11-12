import { FC, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Box } from '@mui/material'

export const MarkdownEditor: FC<{
  value: string
  onChange: (string) => void
}> = ({ value, onChange }) => {
  const [isEditable, setIsEditable] = useState(false)

  return (
    <Box>
      {isEditable ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
