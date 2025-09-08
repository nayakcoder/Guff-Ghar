'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function EmptyState({ 
  title, 
  description, 
  icon: Icon = AlertCircle,
  action 
}) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <Icon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">{description}</p>
        {action && (
          <Button 
            onClick={action.onClick}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>{action.label}</span>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}