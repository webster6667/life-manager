import { createPortal } from 'react-dom'
import { Box, Stack } from '@mui/material'
import CircleIcon from '@mui/icons-material/Circle'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { colors } from './../const'
import { canvasId } from '@renderer/pages/paint/const'

export const PrimaryLinkSettingsPortal = ({ onColorChange, deleteLink, ...props }) => {
  return createPortal(
    <Box {...props}>
      <Stack flexDirection="row">
        {colors.map((color) => (
          <CircleIcon
            style={{ color: color }}
            width={10}
            height={10}
            key={color}
            onClick={() => onColorChange(color)}
          />
        ))}
        <HighlightOffIcon width={10} height={10} onClick={deleteLink} />
      </Stack>
    </Box>,
    document.getElementById(canvasId).firstElementChild.lastElementChild
  )
}
