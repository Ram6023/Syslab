import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Play, RotateCcw } from 'lucide-react';
import { useState } from 'react';

interface QueryPanelProps {
  onQuery: (operation: 'SELECT' | 'PROJECT', condition?: { field: keyof import('@/utils/database-engine').DatabaseRecord; operator: string; value: string | number }) => void;
  onReset: () => void;
}

export function QueryPanel({ onQuery, onReset }: QueryPanelProps) {
  const [operation, setOperation] = useState<'SELECT' | 'PROJECT'>('SELECT');
  const [field, setField] = useState('id');
  const [operator, setOperator] = useState('=');
  const [value, setValue] = useState('');

  const handleExecute = () => {
    if (operation === 'SELECT' && value) {
      const condition = {
        field: field as keyof import('@/utils/database-engine').DatabaseRecord,
        operator,
        value: field === 'id' || field === 'value' ? parseInt(value) || 0 : value,
      };
      onQuery(operation, condition);
    } else {
      onQuery(operation);
    }
  };

  return (
    <Card className="p-4 control-panel">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="operation" className="text-xs uppercase tracking-wide">Operation</Label>
            <Select value={operation} onValueChange={(v) => setOperation(v as 'SELECT' | 'PROJECT')}>
              <SelectTrigger id="operation">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SELECT">SELECT</SelectItem>
                <SelectItem value="PROJECT">PROJECT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {operation === 'SELECT' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="field" className="text-xs uppercase tracking-wide">Field</Label>
                <Select value={field} onValueChange={setField}>
                  <SelectTrigger id="field">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">id</SelectItem>
                    <SelectItem value="name">name</SelectItem>
                    <SelectItem value="value">value</SelectItem>
                    <SelectItem value="category">category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="operator" className="text-xs uppercase tracking-wide">Operator</Label>
                <Select value={operator} onValueChange={setOperator}>
                  <SelectTrigger id="operator">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="=">=</SelectItem>
                    <SelectItem value=">">&gt;</SelectItem>
                    <SelectItem value="<">&lt;</SelectItem>
                    <SelectItem value=">=">&gt;=</SelectItem>
                    <SelectItem value="<=">&lt;=</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="value" className="text-xs uppercase tracking-wide">Value</Label>
                <Input
                  id="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter value"
                  className="font-mono"
                />
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <Button onClick={handleExecute} size="sm">
            <Play className="w-4 h-4 mr-1" />
            Execute Query
          </Button>
          <Button onClick={onReset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
