"use client"

import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ITipoSolicitud } from "@/interfaces/types.interface"

interface CertificadosTableProps {
  data: ITipoSolicitud[]
}

export default function CertificadosTable({ data }: CertificadosTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">No hay certificados disponibles.</div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo de Solicitud</TableHead>
            <TableHead className="text-right">Precio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id ?? item.value}>
              <TableCell className="font-medium">{item.label}</TableCell>
              <TableCell className="text-right">{formatCurrency(+item.precio)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function formatCurrency(n: number | undefined) {
  if (typeof n !== "number") return "-"
  return new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}
