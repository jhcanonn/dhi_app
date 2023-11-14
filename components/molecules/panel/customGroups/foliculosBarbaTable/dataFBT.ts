import {
  FoliculosField,
  FoliculosRow,
  FoliculosType,
  calcDensidadRestante,
  calcTotalArea,
} from '../FoliculosCommon'

export enum RowsCodeFB {
  FB_LD = 'lateral_der',
  FB_LI = 'lateral_izq',
  FB_CD = 'candado_der',
  FB_CI = 'candado_izq',
  FB_B = 'bigote',
  FB_M = 'menton',
  FB_MM = 'medio_menton',
  FB_PD = 'patilla_der',
  FB_PI = 'patilla_izq',
}

export enum FieldsCodeFB {
  FB_ODP = `foliculos_${FoliculosType.BARBA}_odp`,
  FB_LD_DE = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_LD}_de`,
  FB_LD_DR = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_LD}_dr`,
  FB_LD_AA = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_LD}_area_a`,
  FB_LD_AB = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_LD}_area_b`,
  FB_LD_AT = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_LD}_area_total`,
  FB_LD_C = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_LD}_cantidad`,
  FB_LI_DE = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_LI}_de`,
  FB_LI_DR = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_LI}_dr`,
  FB_LI_AA = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_LI}_area_a`,
  FB_LI_AB = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_LI}_area_b`,
  FB_LI_AT = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_LI}_area_total`,
  FB_LI_C = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_LI}_cantidad`,
  FB_CD_DE = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_CD}_de`,
  FB_CD_DR = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_CD}_dr`,
  FB_CD_AA = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_CD}_area_a`,
  FB_CD_AB = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_CD}_area_b`,
  FB_CD_AT = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_CD}_area_total`,
  FB_CD_C = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_CD}_cantidad`,
  FB_CI_DE = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_CI}_de`,
  FB_CI_DR = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_CI}_dr`,
  FB_CI_AA = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_CI}_area_a`,
  FB_CI_AB = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_CI}_area_b`,
  FB_CI_AT = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_CI}_area_total`,
  FB_CI_C = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_CI}_cantidad`,
  FB_B_DE = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_B}_de`,
  FB_B_DR = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_B}_dr`,
  FB_B_AA = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_B}_area_a`,
  FB_B_AB = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_B}_area_b`,
  FB_B_AT = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_B}_area_total`,
  FB_B_C = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_B}_cantidad`,
  FB_M_DE = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_M}_de`,
  FB_M_DR = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_M}_dr`,
  FB_M_AA = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_M}_area_a`,
  FB_M_AB = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_M}_area_b`,
  FB_M_AT = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_M}_area_total`,
  FB_M_C = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_M}_cantidad`,
  FB_MM_DE = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_MM}_de`,
  FB_MM_DR = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_MM}_dr`,
  FB_MM_AA = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_MM}_area_a`,
  FB_MM_AB = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_MM}_area_b`,
  FB_MM_AT = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_MM}_area_total`,
  FB_MM_C = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_MM}_cantidad`,
  FB_PD_DE = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_PD}_de`,
  FB_PD_DR = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_PD}_dr`,
  FB_PD_AA = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_PD}_area_a`,
  FB_PD_AB = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_PD}_area_b`,
  FB_PD_AT = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_PD}_area_total`,
  FB_PD_C = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_PD}_cantidad`,
  FB_PI_DE = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_PI}_de`,
  FB_PI_DR = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_PI}_dr`,
  FB_PI_AA = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_PI}_area_a`,
  FB_PI_AB = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_PI}_area_b`,
  FB_PI_AT = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_PI}_area_total`,
  FB_PI_C = `foliculos_${FoliculosType.BARBA}_${RowsCodeFB.FB_PI}_cantidad`,
  FB_PT = `foliculos_${FoliculosType.BARBA}_pelos_totales`,
  FB_OBS = `foliculos_${FoliculosType.BARBA}_obs`,
}

const lateralDerechoFields: FoliculosField[] = [
  {
    code: FieldsCodeFB.FB_LD_DE,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFB.FB_LD,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_LD_DR,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_LD_AA,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFB.FB_LD,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_LD_AB,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFB.FB_LD,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_LD_AT,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_LD_C,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
]

const lateralIzquierdoFields: FoliculosField[] = [
  {
    code: FieldsCodeFB.FB_LI_DE,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFB.FB_LI,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_LI_DR,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_LI_AA,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFB.FB_LI,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_LI_AB,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFB.FB_LI,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_LI_AT,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_LI_C,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
]

const candadoDerechoFields: FoliculosField[] = [
  {
    code: FieldsCodeFB.FB_CD_DE,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFB.FB_CD,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_CD_DR,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_CD_AA,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFB.FB_CD,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_CD_AB,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFB.FB_CD,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_CD_AT,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_CD_C,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
]

const candadoIzquierdoFields: FoliculosField[] = [
  {
    code: FieldsCodeFB.FB_CI_DE,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFB.FB_CI,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_CI_DR,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_CI_AA,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFB.FB_CI,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_CI_AB,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFB.FB_CI,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_CI_AT,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_CI_C,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
]

const bigoteFields: FoliculosField[] = [
  {
    code: FieldsCodeFB.FB_B_DE,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFB.FB_B,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_B_DR,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_B_AA,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFB.FB_B,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_B_AB,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFB.FB_B,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_B_AT,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_B_C,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
]

const mentonFields: FoliculosField[] = [
  {
    code: FieldsCodeFB.FB_M_DE,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFB.FB_M,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_M_DR,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_M_AA,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFB.FB_M,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_M_AB,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFB.FB_M,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_M_AT,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_M_C,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
]

const medioMentonFields: FoliculosField[] = [
  {
    code: FieldsCodeFB.FB_MM_DE,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFB.FB_MM,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_MM_DR,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_MM_AA,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFB.FB_MM,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_MM_AB,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFB.FB_MM,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_MM_AT,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_MM_C,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
]

const patillaDerechaFields: FoliculosField[] = [
  {
    code: FieldsCodeFB.FB_PD_DE,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFB.FB_PD,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_PD_DR,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_PD_AA,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFB.FB_PD,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_PD_AB,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFB.FB_PD,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_PD_AT,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_PD_C,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
]

const patillaIzquierdaFields: FoliculosField[] = [
  {
    code: FieldsCodeFB.FB_PI_DE,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcDensidadRestante(
        e.value || 0,
        RowsCodeFB.FB_PI,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_PI_DR,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_PI_AA,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'b',
        RowsCodeFB.FB_PI,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_PI_AB,
    required: false,
    onCustomChange: (e, handleForm) =>
      calcTotalArea(
        e.value || 0,
        'a',
        RowsCodeFB.FB_PI,
        FoliculosType.BARBA,
        handleForm,
      ),
  },
  {
    code: FieldsCodeFB.FB_PI_AT,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
  {
    code: FieldsCodeFB.FB_PI_C,
    required: false,
    defaultValue: 0,
    disabled: true,
  },
]

export const barbaRows: FoliculosRow[] = [
  {
    title: 'Lateral derecho',
    fields: lateralDerechoFields,
  },
  {
    title: 'Lateral izquierdo',
    fields: lateralIzquierdoFields,
  },
  {
    title: 'Candado derecho',
    fields: candadoDerechoFields,
  },
  {
    title: 'Candado izquierdo',
    fields: candadoIzquierdoFields,
  },
  {
    title: 'Bigote',
    fields: bigoteFields,
  },
  {
    title: 'Menton',
    fields: mentonFields,
  },
  {
    title: 'Medio menton',
    fields: medioMentonFields,
  },
  {
    title: 'Patilla derecha',
    fields: patillaDerechaFields,
  },
  {
    title: 'Patilla izquierda',
    fields: patillaIzquierdaFields,
  },
]
