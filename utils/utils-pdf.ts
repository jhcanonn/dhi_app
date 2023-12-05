import {
  BudgetItemsBoxServiceId,
  BudgetType,
  FieldTypeDirectus,
  PanelsDirectus,
} from '@models'
import {
  Content,
  DynamicContent,
  Margins,
  TDocumentDefinitions,
} from 'pdfmake/interfaces'
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import {
  IExamenType,
  IRecetaType,
} from '@components/organisms/patient/ExamsPrescriptionTable'
import { generateURLAssetsWithToken } from './url-access-token'
import { getCurrencyCOP } from './helpers'
import {
  FieldsCodeFZD,
  zonaDonanteRows,
} from '@components/molecules/panel/customGroups/foliculosZonaDonanteTable/dataFZDT'
import { PanelGroupCustomCodes } from './settings'
import {
  FieldsCodeFC,
  capilarRows,
} from '@components/molecules/panel/customGroups/foliculosCapilarTable/dataFCT'
import {
  FieldsCodeFB,
  barbaRows,
} from '@components/molecules/panel/customGroups/foliculosBarbaTable/dataFBT'
import {
  FieldsCodeFCJ,
  cejaRows,
} from '@components/molecules/panel/customGroups/foliculosCejaTable/dataFCT'
import { FieldsCodeED } from '@components/molecules/panel/customGroups/extractionDays/dataED'
;(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs

export interface IDataHeader {
  profesionalName: string
  profesionalNumDoc: string
  direccionOficina: string
  profesionalSignature: string
  clienteName: string
  clienteNumDoc: string
  clienteEdad: string
  ClienteDireccion: string
}

const headerDataAndLogoDHI = (
  marginHeader: Margins,
  dataHeader: IDataHeader,
  diagnostico?: { code: string; descripcion: string },
): DynamicContent | Content | undefined => {
  let diagnosticoRow: any[] = [
    {
      text: '',
      bold: true,
      border: [false, false, false, false],
    },
    {
      text: '',
      colSpan: 3,
      border: [false, false, false, false],
    },
    {
      text: '',
      border: [false, false, false, false],
    },
    {
      text: '',
      border: [false, false, false, false],
    },
  ]
  if (diagnostico) {
    diagnosticoRow = [
      {
        stack: [
          {
            columns: [
              { text: 'Diagnóstico probable:', bold: true, width: 125 },
              { text: `${diagnostico.code} - ${diagnostico.descripcion}` },
            ],
          },
        ],
        colSpan: 4,
        border: [false, true, false, true],
      },
      {
        text: '',
        border: [false, true, false, true],
      },
      {
        text: '',
        border: [false, true, false, true],
      },
      {
        text: '',
        border: [false, true, false, true],
      },
    ]
  }
  return {
    stack: [
      {
        columns: [
          {
            image:
              'data:image/png;base64,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', // Ruta de tu imagen
            width: 140,
            height: 80,
          },
          {
            stack: [
              { text: dataHeader.profesionalName, bold: true },
              `${
                dataHeader.profesionalNumDoc
                  ? 'Identificación: ' + dataHeader.profesionalNumDoc
                  : ''
              }`,
              dataHeader.direccionOficina,
            ],
            alignment: 'right',
            margin: [0, 0],
          },
        ],
      },
      ' ',
      {
        table: {
          widths: ['20%', '40%', '10%', '*'],
          body: [
            [
              {
                text: 'Nombre:',
                bold: true,
                border: [false, false, false, false],
              },
              {
                text: dataHeader.clienteName,
                colSpan: 3,
                border: [false, false, false, false],
              },
              {
                text: '',
                border: [false, false, false, false],
              },
              {
                text: '',
                border: [false, false, false, false],
              },
            ],
            [
              {
                text: 'Identificación:',
                bold: true,
                border: [false, true, false, false],
              },
              {
                text: dataHeader.clienteNumDoc,
                border: [false, true, false, false],
              },
              {
                text: 'Edad:',
                bold: true,
                border: [false, true, false, false],
              },
              {
                text: dataHeader.clienteEdad,
                border: [false, true, false, false],
              },
            ],
            [
              {
                text: 'Dirección:',
                bold: true,
                border: [false, true, false, true],
              },
              {
                text: dataHeader.ClienteDireccion,
                colSpan: 3,
                border: [false, true, false, true],
              },
              {
                text: '',
                border: [false, true, false, true],
              },
              {
                text: '',
                border: [false, true, false, true],
              },
            ],
            diagnosticoRow,
          ],
        },
      },
    ],

    margin: marginHeader,
  }
}

const TABLE_COLUMNS_CALCULO_FOLICULOS = [
  '25%',
  '20%',
  '20%',
  '5%',
  '5%',
  '10%',
  '15%',
]
const HEADER_STYLE = { style: 'tableHeader', alignment: 'center' }

const createHeaderRow = (texts: any[]) =>
  texts
    .map((text) => ({ ...text, ...HEADER_STYLE }))
    .reduce((acc: any, cell: any) => {
      acc.push(cell)
      if (cell.colSpan && cell.colSpan > 1) {
        for (let i = 1; i < cell.colSpan; i++) {
          acc.push({ _span: true })
        }
      }
      return acc
    }, [])

const formatFloat = (value: any) => {
  if (value?.toString()?.includes('.')) {
    return parseFloat(value).toFixed(0)
  }
  return value
}

const buildDataRow = (dataKey: any, data: any) => {
  return [
    { text: dataKey.title, style: 'tableHeader' },
    ...dataKey.fields
      .map((key: any) => {
        let value = data[key.code]
        if (Array.isArray(value)) {
          value = value.map((v) => v.value).join('/')
        } else {
          value = formatFloat(value) || value?.toString() || ' '
        }
        return {
          text: value,
          colSpan: key.colspan || undefined,
          alignment: 'center',
        }
      })
      .reduce((acc: any, cell: any) => {
        acc.push(cell)
        if (cell.colSpan && cell.colSpan > 1) {
          for (let i = 1; i < cell.colSpan; i++) {
            acc.push({ _span: true })
          }
        }
        return acc
      }, []),
  ]
}

const buildTotalesRows = (data: any, group: any, bodyTable: any[]): any => {
  switch (group.code) {
    case PanelGroupCustomCodes.FOLICULOS_ZONA_DONANTE:
      bodyTable.push([
        {
          text: `Promedio`,
          style: 'tableHeader',
        },
        {
          text: `${data[FieldsCodeFZD.FZD_TF]}`,
          style: 'tableHeader',
          alignment: 'center',
        },

        {
          text: `Total folículos`,
          style: 'tableHeader',
          alignment: 'right',
          colSpan: 4,
        },
        {},
        {},
        {},
        {
          text: ` ${data[FieldsCodeFZD.FZD_TF]}`,
          style: 'tableHeader',
          alignment: 'center',
        },
      ])

      bodyTable.push([
        {
          text: `No. de pelo para donar`,
          style: 'tableHeader',
          colSpan: 6,
          alignment: 'right',
        },
        {},
        {},
        {},
        {},
        {},
        {
          text: formatFloat(data[FieldsCodeFZD.FZD_FD]),
          style: 'tableHeader',
          alignment: 'center',
        },
      ])
      break
    case PanelGroupCustomCodes.FOLICULOS_CAPILAR:
    case PanelGroupCustomCodes.FOLICULOS_BARBA:
    case PanelGroupCustomCodes.FOLICULOS_CEJA:
      bodyTable.push([
        {
          text: `No. de pelos totales`,
          style: 'tableHeader',
          colSpan: 6,
          alignment: 'right',
        },
        {},
        {},
        {},
        {},
        {},
        {
          text: formatFloat(data[pelosTotalsRows[group.code]]),
          style: 'tableHeader',
          alignment: 'center',
        },
      ])
      break
  }
}

const createDataTable = (widths: any[]) => ({
  table: {
    widths,
    body: [],
    layout: 'lightHorizontalLines',
    headerRows: 1,
    dontBreakRows: true,
  },
})

const buildTableGroupCustom = (data: any, group: any, content: any) => {
  if (group.es_personalizado) {
    let dataTable = createDataTable(TABLE_COLUMNS_CALCULO_FOLICULOS) as any

    // Procesar según el código de grupo
    const stackObs: any = []
    switch (group.code) {
      case PanelGroupCustomCodes.FOLICULOS_ZONA_DONANTE:
      case PanelGroupCustomCodes.FOLICULOS_CAPILAR:
      case PanelGroupCustomCodes.FOLICULOS_BARBA:
      case PanelGroupCustomCodes.FOLICULOS_CEJA: {
        // Configuración del encabezado común
        const headerRow = createHeaderRow([
          { text: '' },
          { text: 'Densidad existente' },
          { text: 'Densidad restante' },
          { text: 'Áreas', colSpan: 2 },
          { text: 'Área total' },
          {
            text:
              PanelGroupCustomCodes.FOLICULOS_ZONA_DONANTE === group.code
                ? 'No. Folículos'
                : 'No. Pelos',
          },
        ])
        dataTable.table.body.push(headerRow)
        if (objetivoRows[group.code]) {
          content.push({
            text: `Objetivo de densidad promedio: ${
              data[objetivoRows[group.code]] ?? ''
            }`,
            margin: [0, 0, 0, 5],
          })
        }

        const rows = groupRows[group.code].map((dataKey: any) =>
          buildDataRow(dataKey, data),
        )

        dataTable.table.body.push(...rows)
        buildTotalesRows(data, group, dataTable.table.body)

        stackObs.push({
          text: data[obsRows[group.code]] ?? '',
          margin: [0, 10],
        })
        break
      }
      case PanelGroupCustomCodes.EXTRACCION_DIAS: {
        console.log('EXTRACCION_DIAS', data)

        let columnsRow = []
        let columnsRowTwo = []
        const bodyTable = []
        for (let index = 1; index <= 7; index++) {
          const rowTable = []
          columnsRow = []
          columnsRowTwo = []
          for (let day = 1; day <= data[FieldsCodeED.ED_CDE]; day++) {
            const dayCode = `_dia${day}`
            const keyGraft = `${FieldsCodeED.ED_G}${index}${dayCode}`
            const keyFoliculos = `${FieldsCodeED.ED_GF}${index}${dayCode}`
            rowTable.push({ text: `${data[keyGraft]}`, alignment: 'center' })
            columnsRowTwo.push({ text: `Graft` })
            rowTable.push({
              text: `${data[keyFoliculos]}`,
              alignment: 'center',
            })
            columnsRowTwo.push({ text: `Foliculos` })
            columnsRow.push({ text: `Día ${day}`, colSpan: 2 })
          }
          const keyFoliculosTotal = `${FieldsCodeED.ED_GF}${index}_total`
          const keyGraftTotal = `${FieldsCodeED.ED_G}${index}_total`
          rowTable.push({
            text: `${data[keyFoliculosTotal]}`,
            alignment: 'center',
          })
          columnsRowTwo.push({ text: `Graft` })
          rowTable.push({ text: `${data[keyGraftTotal]}`, alignment: 'center' })
          columnsRowTwo.push({ text: `Foliculos` })
          columnsRow.push({ text: `Total`, colSpan: 2 })
          bodyTable.push(rowTable)
        }

        //hc_implantecm_gfoliculos_total_dia1

        const headerRow = createHeaderRow(columnsRow)
        const headerRowTwo = createHeaderRow(columnsRowTwo)
        const withs = headerRow.map(() => '*')
        dataTable = createDataTable(withs) as any
        dataTable.table.body.push(headerRow)
        dataTable.table.body.push(headerRowTwo)
        dataTable.table.body.push(...bodyTable)

        // Procesamiento específico para este caso si es necesario
        break
      }
    }

    if (dataTable.table.body.length > 0) content.push(dataTable)
    if (stackObs.length > 0) content.push(stackObs)
  }
}

const groupRows = {
  // Definir las filas para cada grupo específico
  [PanelGroupCustomCodes.FOLICULOS_ZONA_DONANTE]: zonaDonanteRows,
  [PanelGroupCustomCodes.FOLICULOS_CAPILAR]: capilarRows,
  [PanelGroupCustomCodes.FOLICULOS_BARBA]: barbaRows,
  [PanelGroupCustomCodes.FOLICULOS_CEJA]: cejaRows,
}

const obsRows = {
  [PanelGroupCustomCodes.FOLICULOS_ZONA_DONANTE]: FieldsCodeFZD.FZD_OBS,
  [PanelGroupCustomCodes.FOLICULOS_CAPILAR]: FieldsCodeFC.FC_OBS,
  [PanelGroupCustomCodes.FOLICULOS_BARBA]: FieldsCodeFB.FB_OBS,
  [PanelGroupCustomCodes.FOLICULOS_CEJA]: FieldsCodeFCJ.FCJ_OBS,
}

const objetivoRows = {
  [PanelGroupCustomCodes.FOLICULOS_CAPILAR]: FieldsCodeFC.FC_ODP,
  [PanelGroupCustomCodes.FOLICULOS_BARBA]: FieldsCodeFB.FB_ODP,
  [PanelGroupCustomCodes.FOLICULOS_CEJA]: FieldsCodeFCJ.FCJ_ODP,
}

const pelosTotalsRows = {
  [PanelGroupCustomCodes.FOLICULOS_CAPILAR]: FieldsCodeFC.FC_PT,
  [PanelGroupCustomCodes.FOLICULOS_BARBA]: FieldsCodeFB.FB_PT,
  [PanelGroupCustomCodes.FOLICULOS_CEJA]: FieldsCodeFCJ.FCJ_PT,
}

export const generatePanelToPDF = async (
  panel: PanelsDirectus | undefined,
  data: any,
  repeaterHeader: boolean,
  dataHeader: IDataHeader,
) => {
  if (panel) {
    const marginHeader: Margins = repeaterHeader ? [72, 30] : [0, 0, 0, 10]
    const headerPdf = headerDataAndLogoDHI(marginHeader, dataHeader)

    const content: any = []

    panel.agrupadores_id
      .sort((a, b) => a.orden - b.orden)
      .forEach((a) => {
        const group = a.agrupadores_code
        const groupLabel = group.etiqueta?.trim()

        const headerGroup: any = {
          text: groupLabel ?? '',
          style: 'sectionHeader',
        }
        if (groupLabel) content.push(headerGroup)
        if (group.es_personalizado) {
          buildTableGroupCustom(data, group, content)
        } else {
          const dataTable: any = {
            table: {
              widths: ['50%', '50%'],
              body: [],
              layout: 'lightHorizontalLines',
            },
          }
          for (const key in data) {
            const field = group.campos_id.find(
              (c) => c.campos_id.codigo === key,
            )
            if (field) {
              switch (field.campos_id.tipo) {
                /* case FieldTypeDirectus.TEXT:
                  break
                case FieldTypeDirectus.NUMBER:
                  break
                case FieldTypeDirectus.DROPDOWN:
                  break
                case FieldTypeDirectus.DATE:
                  break
                case FieldTypeDirectus.CHECKBOX:
                  break
                case FieldTypeDirectus.PHONE:
                  break
                case FieldTypeDirectus.AUTOCOMPLETE:
                  break*/
                case FieldTypeDirectus.DATETIME:
                  dataTable.table.body.push([
                    {
                      text: field?.campos_id?.etiqueta ?? ' ',
                      bold: true,
                      border: [false, false, false, false],
                    },
                    {
                      text: new Date(data[key]).toLocaleString('es-CO', {
                        hour12: true,
                      }),
                      border: [false, false, false, false],
                    },
                  ])
                  break
                case FieldTypeDirectus.TEXTAREA:
                  dataTable.table.body.push([
                    {
                      text: field?.campos_id?.etiqueta ?? ' ',
                      bold: true,
                      colSpan: 2,
                      border: [false, false, false, false],
                    },
                    {
                      text: ' ',
                      border: [false, false, false, false],
                    },
                  ])
                  dataTable.table.body.push([
                    {
                      text: data[key]
                        ? data[key] && Array.isArray(data[key])
                          ? data[key].map((v: any) => v.value).join('/')
                          : data[key].toString()
                        : ' ',
                      colSpan: 2,
                      border: [false, false, false, false],
                    },
                    {
                      text: ' ',
                      border: [false, false, false, false],
                    },
                  ])
                  break
                default:
                  dataTable.table.body.push([
                    {
                      text: field?.campos_id?.etiqueta ?? ' ',
                      bold: true,
                      border: [false, false, false, false],
                    },
                    {
                      text: data[key]
                        ? data[key] && Array.isArray(data[key])
                          ? data[key].map((v: any) => v.value).join('/')
                          : data[key].toString()
                        : ' ',
                      border: [false, false, false, false],
                    },
                  ])
                  break
              }
            }
          }
          if (dataTable.table.body.length > 0) content.push(dataTable)
        }
      })

    const pageMargins: Margins = !repeaterHeader
      ? [72, 30, 72, 140]
      : [72, 240, 72, 140]

    createOpenPDF(
      headerPdf,
      pageMargins,
      content,
      repeaterHeader,
      dataHeader.profesionalSignature,
    )
  }
}

export const generateExamnToPDF = async (
  exams: IExamenType[],
  diagnostico: {
    code: string
    descripcion: string
  },
  repeaterHeader: boolean,
  dataHeader: IDataHeader,
) => {
  if (exams && exams.length > 0) {
    const marginHeader: Margins = repeaterHeader ? [72, 30] : [0, 0, 0, 10]
    const headerPdf = headerDataAndLogoDHI(
      marginHeader,
      dataHeader,
      diagnostico,
    )
    const pageMargins: Margins = !repeaterHeader
      ? [72, 30, 72, 140]
      : [72, 240, 72, 140]
    const content: any = [
      { text: '\nPre-Implante', style: 'header', margin: [0, 0, 0, 10] },
      {
        ol: [
          ...exams.map((e: IExamenType) => {
            if (!e.descripcion) {
              return [{ text: `${e.examenes_id.nombre} (${e.cantidad})` }]
            }
            return [
              { text: `${e.examenes_id.nombre} (${e.cantidad})` },
              { ul: [`${e.descripcion}`] },
            ]
          }),
        ],
      },
    ]

    createOpenPDF(
      headerPdf,
      pageMargins,
      content,
      repeaterHeader,
      dataHeader.profesionalSignature,
    )
  }
}

export const generatePrescriptionToPDF = async (
  prescription: IRecetaType[],
  repeaterHeader: boolean,
  dataHeader: IDataHeader,
) => {
  if (prescription && prescription.length > 0) {
    const marginHeader: Margins = repeaterHeader ? [72, 30] : [0, 0, 0, 10]

    const headerPdf = headerDataAndLogoDHI(marginHeader, dataHeader)
    const pageMargins: Margins = !repeaterHeader
      ? [72, 30, 72, 140]
      : [72, 240, 72, 140]

    const body = prescription.map((p) => [
      {
        text: p.formula,
        border: [false, false, false, false],
      },
    ])

    const content: any = [
      {
        table: {
          widths: ['100%'],
          body,
          layout: 'lightHorizontalLines',
        },
      },
    ]

    createOpenPDF(
      headerPdf,
      pageMargins,
      content,
      repeaterHeader,
      dataHeader.profesionalSignature,
    )
  }
}

export const generateBudgetToPDF = async (
  panel: BudgetType | undefined,
  repeaterHeader: boolean,
  dataHeader: IDataHeader,
) => {
  if (panel) {
    const marginHeader: Margins = repeaterHeader ? [72, 30] : [0, 0, 0, 10]
    const headerPdf = headerDataAndLogoDHI(marginHeader, dataHeader)

    const productosBody = panel.extraData.productos.map((p) => [
      {
        text: p.productos_id.nombre,
        border: [false, false, false, false],
      },
      {
        text: p.cantidad,
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: getCurrencyCOP(p.valor_unitario),
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: p.descuento,
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: getCurrencyCOP(p.valor_total),
        alignment: 'right',
        border: [false, false, false, false],
      },
    ])

    const serviciosBody = panel.extraData.servicios.map((p) => [
      {
        text: (p.salas_servicios_id.servicios_id as BudgetItemsBoxServiceId)
          .nombre,
        border: [false, false, false, false],
      },
      {
        text: p.cantidad,
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: getCurrencyCOP(p.valor_unitario),
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: p.descuento,
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: getCurrencyCOP(p.valor_total),
        alignment: 'right',
        border: [false, false, false, false],
      },
    ])

    const terapiasBody = panel.extraData.terapias.map((p) => [
      {
        text: p.terapias_salas_servicios_id.terapias_id.nombre,
        border: [false, false, false, false],
      },
      {
        text: p.cantidad,
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: getCurrencyCOP(p.valor_unitario),
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: p.descuento,
        alignment: 'right',
        border: [false, false, false, false],
      },
      {
        text: getCurrencyCOP(p.valor_total),
        alignment: 'right',
        border: [false, false, false, false],
      },
    ])

    const content: any = [
      {
        text: 'Presupuesto',
        style: 'subheader',
      },
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['45%', '15%', '15%', '10%', '15%'],
          heights: [10],
          body: [
            [
              {
                text: 'Detalle',
                style: 'tableHeader',
              },
              {
                text: 'Cantidad',
                style: 'tableHeader',
              },
              {
                text: 'Unidad',
                style: 'tableHeader',
              },
              {
                text: 'Dcto',
                style: 'tableHeader',
              },
              {
                text: 'Total',
                style: 'tableHeader',
              },
            ],
            ...productosBody,
            ...serviciosBody,
            ...terapiasBody,
          ],
        },
      },
      {
        table: {
          widths: ['80%', '20%'],
          body: [
            [
              { text: 'Total a pagar', border: [false, true, false, false] },
              {
                text: panel.value.formated,
                noWrap: true,
                alignment: 'right',
                border: [false, true, false, false],
              },
            ],
          ],
        },
      },
      {
        margin: [0, 10],
        text: 'Formas de pago',
        bold: true,
      },
      {
        text: panel.extraData.presupuesto_formas_pago,
      },
      {
        margin: [0, 10],
        text: 'Incluye',
        bold: true,
      },
      {
        text: panel.extraData.presupuesto_incluye,
      },
      {
        margin: [0, 10],
        text: 'Observaciones',
        bold: true,
      },
      {
        text: panel.extraData.presupuesto_observaciones,
      },
    ]

    const pageMargins: Margins = !repeaterHeader
      ? [72, 30, 72, 140]
      : [72, 240, 72, 140]

    createOpenPDF(
      headerPdf,
      pageMargins,
      content,
      repeaterHeader,
      dataHeader.profesionalSignature,
    )
  }
}

const fetchAndConvert = async (
  url: string,
): Promise<string | ArrayBuffer | null> => {
  const data = await fetch(url)
  const blob = await data.blob()
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    reader.onloadend = () => {
      const base64data = reader.result
      resolve(base64data)
    }
  })
}

const createOpenPDF = async (
  headerPdf: any,
  pageMargins: any,
  content: any[],
  repeaterHeader: boolean,
  idSignature?: string,
) => {
  let signatureFooter = {}
  if (idSignature) {
    const signatureBase64 = await fetchAndConvert(
      generateURLAssetsWithToken(idSignature!, {
        quality: '15',
      }),
    )
    signatureFooter = {
      stack: [
        {
          image: signatureBase64,
          width: 100,
          height: 100,
          margin: [-72, -10, 0, 0],
        },
        {
          text: 'Firma',
          bold: true,
          margin: [-72, 0, 0, 0],
          fontSize: 10,
        },
      ],
    }
  }
  const footer: any = (currentPage: number, pageCount: number) => {
    const t = {
      layout: 'noBorders',
      fontSize: 8,
      margin: [72, 0, 0, 72],
      table: {
        widths: ['80%', '20%'],
        body: [
          [
            {
              text: 'Página  ' + currentPage.toString() + ' de ' + pageCount,
              margin: [0, 100, 0, 0],
            },
            currentPage === pageCount ? signatureFooter : {},
          ],
        ],
      },
    }

    return t
  }

  if (!repeaterHeader) {
    content = [headerPdf, ...content]
  }
  const props: TDocumentDefinitions = {
    header: repeaterHeader ? headerPdf : (undefined as any),
    pageSize: 'LETTER',
    pageMargins,
    content,
    footer: footer,
    styles: {
      sectionHeader: {
        bold: true,
        fontSize: 15,
        margin: [0, 15],
      },
      header: {
        bold: true,
        fontSize: 15,
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5],
      },

      tableHeader: {
        bold: true,
        fontSize: 13,
        color: 'black',
      },
    },
  }
  console.log('props', props)
  const pdfDocGenerator = pdfMake.createPdf(props)
  pdfDocGenerator.open({})
}
