import { Box } from '@mui/material'

export const Shape = ({ shapeOptions, originalHeight, originalWidth }) => {
  const borderRadius = {
    rectangle: '2px',
    diamond: '2px',
    oval: '10px',
    circle: '50%'
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        border: `1px ${shapeOptions.border} silver`,
        borderRadius: borderRadius[shapeOptions.shape],
        transform: `rotate(45deg)`,
        transformOrigin: 'center'
      }}
    />
  )
}
