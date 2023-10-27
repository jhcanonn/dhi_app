import { UseFormReturn } from 'react-hook-form'
import { FoliculosField, FoliculosRow } from '../FoliculosCommon'

export enum RowsCodeFC {
  FC_ZA = 'zonaa',
  FC_ZB = 'zonab',
  FC_ZC = 'zonac',
  FC_LF = 'linea_frontal',
  FC_ED = 'entrada_der',
  FC_EI = 'entrada_izq',
  FC_LD = 'lateral_der',
  FC_LI = 'lateral_izq',
}

export enum FieldsCodeFC {
  FC_ODP = 'foliculos_capilar_odp',
  FC_ZA_DE = `foliculos_capilar_${RowsCodeFC.FC_ZA}_de`,
  FC_ZA_DR = `foliculos_capilar_${RowsCodeFC.FC_ZA}_dr`,
  FC_ZA_AA = `foliculos_capilar_${RowsCodeFC.FC_ZA}_area_a`,
  FC_ZA_AB = `foliculos_capilar_${RowsCodeFC.FC_ZA}_area_b`,
  FC_ZA_AT = `foliculos_capilar_${RowsCodeFC.FC_ZA}_area_total`,
  FC_ZA_C = `foliculos_capilar_${RowsCodeFC.FC_ZA}_cantidad`,
  FC_ZB_DE = `foliculos_capilar_${RowsCodeFC.FC_ZB}_de`,
  FC_ZB_DR = `foliculos_capilar_${RowsCodeFC.FC_ZB}_dr`,
  FC_ZB_AA = `foliculos_capilar_${RowsCodeFC.FC_ZB}_area_a`,
  FC_ZB_AB = `foliculos_capilar_${RowsCodeFC.FC_ZB}_area_b`,
  FC_ZB_AT = `foliculos_capilar_${RowsCodeFC.FC_ZB}_area_total`,
  FC_ZB_C = `foliculos_capilar_${RowsCodeFC.FC_ZB}_cantidad`,
  FC_ZC_DE = `foliculos_capilar_${RowsCodeFC.FC_ZC}_de`,
  FC_ZC_DR = `foliculos_capilar_${RowsCodeFC.FC_ZC}_dr`,
  FC_ZC_AA = `foliculos_capilar_${RowsCodeFC.FC_ZC}_area_a`,
  FC_ZC_AB = `foliculos_capilar_${RowsCodeFC.FC_ZC}_area_b`,
  FC_ZC_AT = `foliculos_capilar_${RowsCodeFC.FC_ZC}_area_total`,
  FC_ZC_C = `foliculos_capilar_${RowsCodeFC.FC_ZC}_cantidad`,
  FC_LF_DE = `foliculos_capilar_${RowsCodeFC.FC_LF}_de`,
  FC_LF_DR = `foliculos_capilar_${RowsCodeFC.FC_LF}_dr`,
  FC_LF_A = `foliculos_capilar_${RowsCodeFC.FC_LF}_area`,
  FC_LF_C = `foliculos_capilar_${RowsCodeFC.FC_LF}_cantidad`,
  FC_ED_DE = `foliculos_capilar_${RowsCodeFC.FC_ED}_de`,
  FC_ED_DR = `foliculos_capilar_${RowsCodeFC.FC_ED}_dr`,
  FC_ED_AA = `foliculos_capilar_${RowsCodeFC.FC_ED}_area_a`,
  FC_ED_AB = `foliculos_capilar_${RowsCodeFC.FC_ED}_area_b`,
  FC_ED_AT = `foliculos_capilar_${RowsCodeFC.FC_ED}_area_total`,
  FC_ED_C = `foliculos_capilar_${RowsCodeFC.FC_ED}_cantidad`,
  FC_EI_DE = `foliculos_capilar_${RowsCodeFC.FC_EI}_de`,
  FC_EI_DR = `foliculos_capilar_${RowsCodeFC.FC_EI}_dr`,
  FC_EI_AA = `foliculos_capilar_${RowsCodeFC.FC_EI}_area_a`,
  FC_EI_AB = `foliculos_capilar_${RowsCodeFC.FC_EI}_area_b`,
  FC_EI_AT = `foliculos_capilar_${RowsCodeFC.FC_EI}_area_total`,
  FC_EI_C = `foliculos_capilar_${RowsCodeFC.FC_EI}_cantidad`,
  FC_LD_DE = `foliculos_capilar_${RowsCodeFC.FC_LD}_de`,
  FC_LD_DR = `foliculos_capilar_${RowsCodeFC.FC_LD}_dr`,
  FC_LD_AA = `foliculos_capilar_${RowsCodeFC.FC_LD}_area_a`,
  FC_LD_AB = `foliculos_capilar_${RowsCodeFC.FC_LD}_area_b`,
  FC_LD_AT = `foliculos_capilar_${RowsCodeFC.FC_LD}_area_total`,
  FC_LD_C = `foliculos_capilar_${RowsCodeFC.FC_LD}_cantidad`,
  FC_LI_DE = `foliculos_capilar_${RowsCodeFC.FC_LI}_de`,
  FC_LI_DR = `foliculos_capilar_${RowsCodeFC.FC_LI}_dr`,
  FC_LI_AA = `foliculos_capilar_${RowsCodeFC.FC_LI}_area_a`,
  FC_LI_AB = `foliculos_capilar_${RowsCodeFC.FC_LI}_area_b`,
  FC_LI_AT = `foliculos_capilar_${RowsCodeFC.FC_LI}_area_total`,
  FC_LI_C = `foliculos_capilar_${RowsCodeFC.FC_LI}_cantidad`,
  FC_PT = 'foliculos_capilar_pelos_totales',
  FC_OBS = 'foliculos_capilar_obs',
}

const calcDensidadRestante = (
  currentValue: number,
  drField: RowsCodeFC,
  handleForm: UseFormReturn<any, any, undefined>,
  setCantidad: boolean = true,
) => {
  const { setValue, getValues } = handleForm
  const resta = getValues(FieldsCodeFC.FC_ODP) - currentValue
  setValue(`foliculos_capilar_${drField}_dr`, resta >= 0 ? resta : 0)
  setCantidad &&
    setValue(
      `foliculos_capilar_${drField}_cantidad`,
      getValues(`foliculos_capilar_${drField}_dr`) *
        getValues(`foliculos_capilar_${drField}_area_total`),
    )
}

export const calcNoFoliculos = (
  code: string,
  handleForm: UseFormReturn<any, any, undefined>,
) => {
  const { setValue, getValues } = handleForm
  const drValue = getValues(`foliculos_capilar_${code}_dr`) || 0
  const atValue = getValues(`foliculos_capilar_${code}_area_total`) || 0
  setValue(`foliculos_capilar_${code}_cantidad`, drValue * atValue)
}

const calcTotalArea = (
  currentValue: number,
  otherZone: 'a' | 'b',
  rowCode: RowsCodeFC,
  handleForm: UseFormReturn<any, any, undefined>,
  withPi?: boolean,
) => {
  const { setValue, getValues } = handleForm
  const otherValue =
    getValues(`foliculos_capilar_${rowCode}_area_${otherZone}`) || 0
  const multiplication = currentValue * otherValue
  const result = withPi ? (multiplication * Math.PI) / 4 : multiplication
  setValue(`foliculos_capilar_${rowCode}_area_total`, result)
  calcNoFoliculos(rowCode, handleForm)
}

const zonaaFields: FoliculosField[] = [
  {
    code: FieldsCodeFC.FC_ZA_DE,
    suffix: ' cm²',
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(e.value || 0, RowsCodeFC.FC_ZA, handleForm),
  },
  {
    code: FieldsCodeFC.FC_ZA_DR,
    suffix: ' cm²',
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_ZA_AA,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'b', RowsCodeFC.FC_ZA, handleForm, true),
  },
  {
    code: FieldsCodeFC.FC_ZA_AB,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'a', RowsCodeFC.FC_ZA, handleForm, true),
  },
  {
    code: FieldsCodeFC.FC_ZA_AT,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_ZA_C,
    defaultValue: 0,
    disabled: true,
  },
]

const zonabFields: FoliculosField[] = [
  {
    code: FieldsCodeFC.FC_ZB_DE,
    suffix: ' cm²',
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(e.value || 0, RowsCodeFC.FC_ZB, handleForm),
  },
  {
    code: FieldsCodeFC.FC_ZB_DR,
    suffix: ' cm²',
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_ZB_AA,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'b', RowsCodeFC.FC_ZB, handleForm),
  },
  {
    code: FieldsCodeFC.FC_ZB_AB,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'a', RowsCodeFC.FC_ZB, handleForm),
  },
  {
    code: FieldsCodeFC.FC_ZB_AT,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_ZB_C,
    defaultValue: 0,
    disabled: true,
  },
]

const zonacFields: FoliculosField[] = [
  {
    code: FieldsCodeFC.FC_ZC_DE,
    suffix: ' cm²',
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(e.value || 0, RowsCodeFC.FC_ZC, handleForm),
  },
  {
    code: FieldsCodeFC.FC_ZC_DR,
    suffix: ' cm²',
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_ZC_AA,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'b', RowsCodeFC.FC_ZC, handleForm),
  },
  {
    code: FieldsCodeFC.FC_ZC_AB,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'a', RowsCodeFC.FC_ZC, handleForm),
  },
  {
    code: FieldsCodeFC.FC_ZC_AT,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_ZC_C,
    defaultValue: 0,
    disabled: true,
  },
]

const lineaFrontalFields: FoliculosField[] = [
  {
    code: FieldsCodeFC.FC_LF_DE,
    suffix: ' cm²',
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(e.value || 0, RowsCodeFC.FC_LF, handleForm, false),
  },
  {
    code: FieldsCodeFC.FC_LF_DR,
    suffix: ' cm²',
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_LF_A,
    colspan: 3,
  },
  {
    code: FieldsCodeFC.FC_LF_C,
    defaultValue: 0,
  },
]

const entradaDerechaFields: FoliculosField[] = [
  {
    code: FieldsCodeFC.FC_ED_DE,
    suffix: ' cm²',
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(e.value || 0, RowsCodeFC.FC_ED, handleForm),
  },
  {
    code: FieldsCodeFC.FC_ED_DR,
    suffix: ' cm²',
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_ED_AA,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'b', RowsCodeFC.FC_ED, handleForm),
  },
  {
    code: FieldsCodeFC.FC_ED_AB,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'a', RowsCodeFC.FC_ED, handleForm),
  },
  {
    code: FieldsCodeFC.FC_ED_AT,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_ED_C,
    defaultValue: 0,
    disabled: true,
  },
]

const entradaIzquierdaFields: FoliculosField[] = [
  {
    code: FieldsCodeFC.FC_EI_DE,
    suffix: ' cm²',
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(e.value || 0, RowsCodeFC.FC_EI, handleForm),
  },
  {
    code: FieldsCodeFC.FC_EI_DR,
    suffix: ' cm²',
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_EI_AA,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'b', RowsCodeFC.FC_EI, handleForm),
  },
  {
    code: FieldsCodeFC.FC_EI_AB,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'a', RowsCodeFC.FC_EI, handleForm),
  },
  {
    code: FieldsCodeFC.FC_EI_AT,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_EI_C,
    defaultValue: 0,
    disabled: true,
  },
]

const lateralDerechoFields: FoliculosField[] = [
  {
    code: FieldsCodeFC.FC_LD_DE,
    suffix: ' cm²',
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(e.value || 0, RowsCodeFC.FC_LD, handleForm),
  },
  {
    code: FieldsCodeFC.FC_LD_DR,
    suffix: ' cm²',
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_LD_AA,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'b', RowsCodeFC.FC_LD, handleForm),
  },
  {
    code: FieldsCodeFC.FC_LD_AB,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'a', RowsCodeFC.FC_LD, handleForm),
  },
  {
    code: FieldsCodeFC.FC_LD_AT,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_LD_C,
    defaultValue: 0,
    disabled: true,
  },
]

const lateralIzquerdoFields: FoliculosField[] = [
  {
    code: FieldsCodeFC.FC_LI_DE,
    suffix: ' cm²',
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(e.value || 0, RowsCodeFC.FC_LI, handleForm),
  },
  {
    code: FieldsCodeFC.FC_LI_DR,
    suffix: ' cm²',
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_LI_AA,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'b', RowsCodeFC.FC_LI, handleForm),
  },
  {
    code: FieldsCodeFC.FC_LI_AB,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(e.value || 0, 'a', RowsCodeFC.FC_LI, handleForm),
  },
  {
    code: FieldsCodeFC.FC_LI_AT,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_LI_C,
    defaultValue: 0,
    disabled: true,
  },
]

export const capilarRows: FoliculosRow[] = [
  {
    title: 'Zona A',
    fields: zonaaFields,
  },
  {
    title: 'Zona B',
    fields: zonabFields,
  },
  {
    title: 'Zona C',
    fields: zonacFields,
  },
  {
    title: 'Linea frontal',
    fields: lineaFrontalFields,
  },
  {
    title: 'Entrada derecha',
    fields: entradaDerechaFields,
  },
  {
    title: 'Entrada izquierda',
    fields: entradaIzquierdaFields,
  },
  {
    title: 'Lateral derecho',
    fields: lateralDerechoFields,
  },
  {
    title: 'Lateral izquierdo',
    fields: lateralIzquerdoFields,
  },
]
