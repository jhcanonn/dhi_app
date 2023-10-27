import {
  FoliculosField,
  FoliculosRow,
  FoliculosType,
  calcDensidadRestante,
  calcTotalArea,
} from '../FoliculosCommon'

export enum RowsCodeFCJ {
  FCJ_CD = 'ceja_der',
  FCJ_CI = 'ceja_izq',
}

export enum FieldsCodeFCJ {
  FCJ_ODP = `foliculos_${FoliculosType.CEJA}_odp`,
  FCJ_CD_DE = `foliculos_${FoliculosType.CEJA}_${RowsCodeFCJ.FCJ_CD}_de`,
  FCJ_CD_DR = `foliculos_${FoliculosType.CEJA}_${RowsCodeFCJ.FCJ_CD}_dr`,
  FCJ_CD_AA = `foliculos_${FoliculosType.CEJA}_${RowsCodeFCJ.FCJ_CD}_area_a`,
  FCJ_CD_AB = `foliculos_${FoliculosType.CEJA}_${RowsCodeFCJ.FCJ_CD}_area_b`,
  FCJ_CD_AT = `foliculos_${FoliculosType.CEJA}_${RowsCodeFCJ.FCJ_CD}_area_total`,
  FCJ_CD_C = `foliculos_${FoliculosType.CEJA}_${RowsCodeFCJ.FCJ_CD}_cantidad`,
  FCJ_CI_DE = `foliculos_${FoliculosType.CEJA}_${RowsCodeFCJ.FCJ_CI}_de`,
  FCJ_CI_DR = `foliculos_${FoliculosType.CEJA}_${RowsCodeFCJ.FCJ_CI}_dr`,
  FCJ_CI_AA = `foliculos_${FoliculosType.CEJA}_${RowsCodeFCJ.FCJ_CI}_area_a`,
  FCJ_CI_AB = `foliculos_${FoliculosType.CEJA}_${RowsCodeFCJ.FCJ_CI}_area_b`,
  FCJ_CI_AT = `foliculos_${FoliculosType.CEJA}_${RowsCodeFCJ.FCJ_CI}_area_total`,
  FCJ_CI_C = `foliculos_${FoliculosType.CEJA}_${RowsCodeFCJ.FCJ_CI}_cantidad`,
  FCJ_PT = `foliculos_${FoliculosType.CEJA}_pelos_totales`,
  FCJ_OBS = `foliculos_${FoliculosType.CEJA}_obs`,
}

const cejaDerechaFields: FoliculosField[] = [
  {
    code: FieldsCodeFCJ.FCJ_CD_DE,
    suffix: ' cm²',
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFCJ.FCJ_CD,
        FoliculosType.CEJA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFCJ.FCJ_CD_DR,
    suffix: ' cm²',
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFCJ.FCJ_CD_AA,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFCJ.FCJ_CD,
        FoliculosType.CEJA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFCJ.FCJ_CD_AB,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFCJ.FCJ_CD,
        FoliculosType.CEJA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFCJ.FCJ_CD_AT,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFCJ.FCJ_CD_C,
    defaultValue: 0,
    disabled: true,
  },
]

const cejaIzquierdaFields: FoliculosField[] = [
  {
    code: FieldsCodeFCJ.FCJ_CI_DE,
    suffix: ' cm²',
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFCJ.FCJ_CI,
        FoliculosType.CEJA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFCJ.FCJ_CI_DR,
    suffix: ' cm²',
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFCJ.FCJ_CI_AA,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFCJ.FCJ_CI,
        FoliculosType.CEJA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFCJ.FCJ_CI_AB,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFCJ.FCJ_CI,
        FoliculosType.CEJA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFCJ.FCJ_CI_AT,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFCJ.FCJ_CI_C,
    defaultValue: 0,
    disabled: true,
  },
]

export const cejaRows: FoliculosRow[] = [
  {
    title: 'Ceja derecha',
    fields: cejaDerechaFields,
  },
  {
    title: 'Ceja izquierda',
    fields: cejaIzquierdaFields,
  },
]
