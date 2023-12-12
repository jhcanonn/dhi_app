import {
  FoliculosField,
  FoliculosRow,
  FoliculosType,
  calcDensidadRestante,
  calcTotalArea,
} from '../FoliculosCommon'

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
  FC_ODP = `foliculos_${FoliculosType.CAPILAR}_odp`,
  FC_ZA_DE = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZA}_de`,
  FC_ZA_DR = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZA}_dr`,
  FC_ZA_AA = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZA}_area_a`,
  FC_ZA_AB = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZA}_area_b`,
  FC_ZA_AT = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZA}_area_total`,
  FC_ZA_C = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZA}_cantidad`,
  FC_ZB_DE = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZB}_de`,
  FC_ZB_DR = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZB}_dr`,
  FC_ZB_AA = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZB}_area_a`,
  FC_ZB_AB = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZB}_area_b`,
  FC_ZB_AT = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZB}_area_total`,
  FC_ZB_C = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZB}_cantidad`,
  FC_ZC_DE = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZC}_de`,
  FC_ZC_DR = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZC}_dr`,
  FC_ZC_AA = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZC}_area_a`,
  FC_ZC_AB = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZC}_area_b`,
  FC_ZC_AT = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZC}_area_total`,
  FC_ZC_C = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ZC}_cantidad`,
  FC_LF_DE = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LF}_de`,
  FC_LF_DR = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LF}_dr`,
  FC_LF_A = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LF}_area`,
  FC_LF_C = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LF}_cantidad`,
  FC_ED_DE = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ED}_de`,
  FC_ED_DR = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ED}_dr`,
  FC_ED_AA = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ED}_area_a`,
  FC_ED_AB = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ED}_area_b`,
  FC_ED_AT = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ED}_area_total`,
  FC_ED_C = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_ED}_cantidad`,
  FC_EI_DE = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_EI}_de`,
  FC_EI_DR = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_EI}_dr`,
  FC_EI_AA = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_EI}_area_a`,
  FC_EI_AB = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_EI}_area_b`,
  FC_EI_AT = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_EI}_area_total`,
  FC_EI_C = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_EI}_cantidad`,
  FC_LD_DE = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LD}_de`,
  FC_LD_DR = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LD}_dr`,
  FC_LD_AA = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LD}_area_a`,
  FC_LD_AB = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LD}_area_b`,
  FC_LD_AT = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LD}_area_total`,
  FC_LD_C = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LD}_cantidad`,
  FC_LI_DE = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LI}_de`,
  FC_LI_DR = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LI}_dr`,
  FC_LI_AA = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LI}_area_a`,
  FC_LI_AB = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LI}_area_b`,
  FC_LI_AT = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LI}_area_total`,
  FC_LI_C = `foliculos_${FoliculosType.CAPILAR}_${RowsCodeFC.FC_LI}_cantidad`,
  FC_PT = `foliculos_${FoliculosType.CAPILAR}_pelos_totales`,
  FC_OBS = `foliculos_${FoliculosType.CAPILAR}_obs`,
}

const zonaaFields: FoliculosField[] = [
  {
    code: FieldsCodeFC.FC_ZA_DE,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFC.FC_ZA,
        FoliculosType.CAPILAR,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFC.FC_ZA_DR,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_ZA_AA,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFC.FC_ZA,
        FoliculosType.CAPILAR,
        handleForm,
        true,
      ),
  },
  {
    code: FieldsCodeFC.FC_ZA_AB,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFC.FC_ZA,
        FoliculosType.CAPILAR,
        handleForm,
        true,
      ),
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
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFC.FC_ZB,
        FoliculosType.CAPILAR,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFC.FC_ZB_DR,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_ZB_AA,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFC.FC_ZB,
        FoliculosType.CAPILAR,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFC.FC_ZB_AB,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFC.FC_ZB,
        FoliculosType.CAPILAR,
        handleForm,
      ),
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
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFC.FC_ZC,
        FoliculosType.CAPILAR,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFC.FC_ZC_DR,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_ZC_AA,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFC.FC_ZC,
        FoliculosType.CAPILAR,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFC.FC_ZC_AB,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFC.FC_ZC,
        FoliculosType.CAPILAR,
        handleForm,
      ),
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
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFC.FC_LF,
        FoliculosType.CAPILAR,
        handleForm,
        false,
      ),
  },
  {
    code: FieldsCodeFC.FC_LF_DR,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_LF_A,
    defaultValue: 0,
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
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFC.FC_ED,
        FoliculosType.CAPILAR,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFC.FC_ED_DR,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_ED_AA,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFC.FC_ED,
        FoliculosType.CAPILAR,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFC.FC_ED_AB,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFC.FC_ED,
        FoliculosType.CAPILAR,
        handleForm,
      ),
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
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFC.FC_EI,
        FoliculosType.CAPILAR,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFC.FC_EI_DR,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_EI_AA,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFC.FC_EI,
        FoliculosType.CAPILAR,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFC.FC_EI_AB,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFC.FC_EI,
        FoliculosType.CAPILAR,
        handleForm,
      ),
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
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFC.FC_LD,
        FoliculosType.CAPILAR,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFC.FC_LD_DR,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_LD_AA,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFC.FC_LD,
        FoliculosType.CAPILAR,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFC.FC_LD_AB,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFC.FC_LD,
        FoliculosType.CAPILAR,
        handleForm,
      ),
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
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFC.FC_LI,
        FoliculosType.CAPILAR,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFC.FC_LI_DR,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFC.FC_LI_AA,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFC.FC_LI,
        FoliculosType.CAPILAR,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFC.FC_LI_AB,
    defaultValue: 0,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFC.FC_LI,
        FoliculosType.CAPILAR,
        handleForm,
      ),
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
