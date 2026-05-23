import { Card, CardContent, Typography } from '@mui/material';

export default function StatsCard({ title, value }) {
  return (
    <Card sx={{ minWidth: 180 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5">{value}</Typography>
      </CardContent>
    </Card>
  );
}
