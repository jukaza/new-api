/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useState, useMemo, useEffect, useCallback, memo } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { safeJsonParse } from '../utils/json-parser'

type SimpleGroupDiscountEditorProps = {
  groupRatio: string
  userUsableGroups: string
  onChange: (field: string, value: string) => void
}

// A row in the simplified group pricing table.
// discount: percentage discount vs base price (0 = no discount, 10 = -10%).
// The backend stores group ratio as a multiplier, so we convert between
// discount (%) and ratio (ratio = 1 - discount/100).
type GroupDiscountRow = {
  _id: string
  name: string
  discount: number
  description: string
}

let groupIdCounter = 0
function createGroupId() {
  groupIdCounter += 1
  return `gd_${groupIdCounter}`
}

function ratioToDiscount(ratio: number): number {
  const discount = Math.round((1 - ratio) * 100)
  return Math.min(100, Math.max(0, discount))
}

function discountToRatio(discount: number): number {
  return 1 - discount / 100
}

function buildRows(
  groupRatio: string,
  userUsableGroups: string
): GroupDiscountRow[] {
  const ratioMap = safeJsonParse<Record<string, number>>(groupRatio, {
    fallback: {},
    context: 'group ratios',
  })
  const usableMap = safeJsonParse<Record<string, string>>(userUsableGroups, {
    fallback: {},
    context: 'user usable groups',
  })
  const names = new Set([...Object.keys(ratioMap), ...Object.keys(usableMap)])

  return Array.from(names).map((name) => ({
    _id: createGroupId(),
    name,
    discount: ratioToDiscount(Number(ratioMap[name]) ?? 1),
    description: String(usableMap[name] ?? ''),
  }))
}

function serialize(rows: GroupDiscountRow[]) {
  const groupRatio: Record<string, number> = {}
  const userUsableGroups: Record<string, string> = {}

  for (const row of rows) {
    const name = row.name.trim()
    if (!name) continue
    groupRatio[name] = discountToRatio(row.discount)
    userUsableGroups[name] = row.description
  }

  return {
    GroupRatio: JSON.stringify(groupRatio, null, 2),
    UserUsableGroups: JSON.stringify(userUsableGroups, null, 2),
  }
}

function rowsSignature(rows: GroupDiscountRow[]): string {
  return JSON.stringify(serialize(rows))
}

function sourceSignature(
  groupRatio: string,
  userUsableGroups: string
): string {
  return JSON.stringify({
    groupRatio: safeJsonParse(groupRatio, { fallback: {}, silent: true }),
    userUsableGroups: safeJsonParse(userUsableGroups, {
      fallback: {},
      silent: true,
    }),
  })
}

export const SimpleGroupDiscountEditor = memo(
  function SimpleGroupDiscountEditor({
    groupRatio,
    userUsableGroups,
    onChange,
  }: SimpleGroupDiscountEditorProps) {
    const { t } = useTranslation()
    const [rows, setRows] = useState<GroupDiscountRow[]>(() =>
      buildRows(groupRatio, userUsableGroups)
    )

    // Sync local state when the underlying JSON changes externally.
    useEffect(() => {
      const incoming = sourceSignature(groupRatio, userUsableGroups)
      setRows((currentRows) => {
        if (rowsSignature(currentRows) === incoming) {
          return currentRows
        }
        return buildRows(groupRatio, userUsableGroups)
      })
    }, [groupRatio, userUsableGroups])

    const emitRows = useCallback(
      (nextRows: GroupDiscountRow[]) => {
        setRows(nextRows)
        const serialized = serialize(nextRows)
        onChange('GroupRatio', serialized.GroupRatio)
        onChange('UserUsableGroups', serialized.UserUsableGroups)
      },
      [onChange]
    )

    const updateRow = useCallback(
      (
        id: string,
        field: Exclude<keyof GroupDiscountRow, '_id'>,
        value: string | number
      ) => {
        emitRows(
          rows.map((row) => (row._id === id ? { ...row, [field]: value } : row))
        )
      },
      [emitRows, rows]
    )

    const addRow = useCallback(() => {
      const existingNames = new Set(rows.map((row) => row.name))
      let index = 1
      let name = `group_${index}`
      while (existingNames.has(name)) {
        index += 1
        name = `group_${index}`
      }
      emitRows([
        ...rows,
        {
          _id: createGroupId(),
          name,
          discount: 0,
          description: '',
        },
      ])
    }, [emitRows, rows])

    const removeRow = useCallback(
      (id: string) => {
        emitRows(rows.filter((row) => row._id !== id))
      },
      [emitRows, rows]
    )

    const duplicateNames = useMemo(() => {
      const counts = new Map<string, number>()
      for (const row of rows) {
        const name = row.name.trim()
        if (!name) continue
        counts.set(name, (counts.get(name) ?? 0) + 1)
      }
      return Array.from(counts.entries())
        .filter(([, count]) => count > 1)
        .map(([name]) => name)
    }, [rows])

    return (
      <Card>
        <CardHeader>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
            <div>
              <CardTitle>{t('Discount groups')}</CardTitle>
              <CardDescription>
                {t(
                  'Tạo nhóm giảm giá: thêm tên nhóm, nhập % giảm so với giá gốc. Mọi kênh tự động phục vụ mọi nhóm — không cần gán nhóm cho kênh hay mô hình.'
                )}
              </CardDescription>
            </div>
            <Button onClick={addRow} size='sm' className='sm:self-start'>
              <Plus className='mr-2 h-4 w-4' />
              {t('Add group')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className='space-y-3'>
            <div className='overflow-hidden rounded-md border'>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='min-w-40'>
                      {t('Group name')}
                    </TableHead>
                    <TableHead className='w-32'>
                      {t('Discount %')}
                    </TableHead>
                    <TableHead className='min-w-56'>
                      {t('Description')}
                    </TableHead>
                    <TableHead className='w-16 text-right'>
                      {t('Actions')}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className='text-muted-foreground h-20 text-center text-sm'
                      >
                        {t('No groups yet. Add a group to get started.')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell>
                          <Input
                            value={row.name}
                            onChange={(event) =>
                              updateRow(row._id, 'name', event.target.value)
                            }
                            aria-invalid={duplicateNames.includes(
                              row.name.trim()
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-1'>
                            <Input
                              type='number'
                              min={0}
                              max={100}
                              step={1}
                              value={String(row.discount)}
                              onChange={(event) => {
                                const parsed = Number(event.target.value)
                                updateRow(
                                  row._id,
                                  'discount',
                                  Number.isFinite(parsed)
                                    ? Math.min(100, Math.max(0, parsed))
                                    : 0
                                )
                              }}
                            />
                            <span className='text-muted-foreground text-sm'>
                              %
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            value={row.description}
                            placeholder={t('Group description')}
                            onChange={(event) =>
                              updateRow(
                                row._id,
                                'description',
                                event.target.value
                              )
                            }
                          />
                        </TableCell>
                        <TableCell className='text-right'>
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => removeRow(row._id)}
                            aria-label={t('Delete')}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {duplicateNames.length > 0 && (
              <p className='text-destructive text-sm'>
                {t('Duplicate group names: {{names}}', {
                  names: duplicateNames.join(', '),
                })}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)