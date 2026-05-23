import { Card, CardContent, Typography } from '@mui/material';

export default function StatsCard({ title, value }) {
  return (
    <Card
      sx={{
        minWidth: 180,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        bgcolor: 'background.default',
      }}
    >
      <CardContent sx={{ py: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {title}
        </Typography>
        <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 700 }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
