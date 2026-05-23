import { Card, CardContent, Typography, Box } from '@mui/material';

export default function StatsCard({ title, value, icon, color, secondary, variant = 'default' }) {
  const borderColors = {
    default: 'divider',
    primary: '#1e3a5f',
    success: '#16a34a',
    warning: '#d97706',
    budget: '#7c3aed',
  };

  return (
    <Card
      sx={{
        minWidth: 180,
        border: '1px solid',
        borderColor: borderColors[color || variant] || 'divider',
        borderLeftWidth: color || variant !== 'default' ? 3 : 1,
        boxShadow: 'none',
        bgcolor: 'background.default',
      }}
    >
      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
          {icon && <Box sx={{ color: 'text.secondary', display: 'flex' }}>{icon}</Box>}
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant={variant === 'primary' ? 'h4' : 'h5'} sx={{ fontWeight: 700 }}>
          {value}
        </Typography>
        {secondary && (
          <Typography variant="caption" color="text.disabled" sx={{ mt: 0.25, display: 'block' }}>
            {secondary}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
