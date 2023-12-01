import { gql } from '@apollo/client'

export const GET_TOKEN = gql`
  mutation Login($email: String!, $password: String!) {
    auth_login(email: $email, password: $password) {
      access_token
      refresh_token
      expires
    }
  }
`

export const DELETE_APPOINTMENT = gql`
  mutation DeleteAppointment($id: ID!) {
    delete_citas_item(id: $id) {
      id
    }
  }
`

export const UPDATE_PATIENT = gql`
  mutation UpdatePatient($id: ID!, $data: update_pacientes_input!) {
    update_pacientes_item(id: $id, data: $data) {
      id
      documento
    }
  }
`

export const CREATE_ATTENTION = gql`
  mutation CreateAttention(
    $fichaId: ID!
    $panelCode: ID!
    $userId: ID!
    $sucursal: String
    $valores: JSON
  ) {
    create_historico_atenciones_item(
      data: {
        panel_id: { code: $panelCode }
        ficha_id: { id: $fichaId }
        user_created: { id: $userId }
        sucursal: $sucursal
        valores: $valores
      }
    ) {
      id
      date_created
      sucursal
      valores
      user_created {
        profesional {
          nombre
          identificacion
          no_registro_medico
          firma {
            id
            title
          }
        }
      }
      panel_id {
        code
        nombre
      }
    }
  }
`

export const UPDATE_ATTENTION = gql`
  mutation UpdateAttention($atentionId: ID!, $valores: JSON, $status: String) {
    update_historico_atenciones_item(
      id: $atentionId
      data: { valores: $valores, status: $status }
    ) {
      id
      valores
      status
    }
  }
`

export const CREATE_MEDICAL_COMPLEMENT = gql`
  mutation CreateMedicalComplement(
    $fichaId: ID!
    $tipo: String
    $cantidad: Int
    $descripcion: String
    $examenes: [create_complementos_medicos_examenes_input!]
    $recetas: [create_complementos_medicos_recetas_input!]
    $diagnostico: create_cie_10_input
  ) {
    create_complementos_medicos_item(
      data: {
        ficha_id: { id: $fichaId }
        tipo: $tipo
        cantidad: $cantidad
        descripcion: $descripcion
        examenes: $examenes
        recetas: $recetas
        diagnostico: $diagnostico
      }
    ) {
      id
      estado
      orden
      date_updated
      tipo
      user_created {
        id
        first_name
        last_name
        profesional {
          nombre
          identificacion
          especialidad
          cargo
          no_registro_medico
          firma {
            id
            filename_disk
          }
        }
      }
      date_created
      cantidad
      descripcion
      diagnostico {
        code
        descripcion
      }
      ficha_id {
        id
      }
      examenes {
        id
        examenes_id {
          id
          estado
          orden
          nombre
          codigo
          cantidad
          categoria
        }
        cantidad
        descripcion
      }
      recetas {
        id
        Recetas_id {
          id
          estado
          nombre
          diagnostico
          receta
          orden
        }
        formula
      }
    }
  }
`

export const UPDATE_MEDICAL_COMPLEMENT = gql`
  mutation UpdateMedicalComplement(
    $id: ID!
    $cantidad: Int
    $descripcion: String
    $examenes: [update_complementos_medicos_examenes_input!]
    $recetas: [update_complementos_medicos_recetas_input!]
    $diagnostico: update_cie_10_input
  ) {
    update_complementos_medicos_item(
      id: $id
      data: {
        cantidad: $cantidad
        descripcion: $descripcion
        examenes: $examenes
        recetas: $recetas
        diagnostico: $diagnostico
      }
    ) {
      id
      estado
      orden
      date_updated
      tipo
      user_created {
        id
        first_name
        last_name
        profesional {
          nombre
          identificacion
          especialidad
          cargo
          no_registro_medico
          firma {
            id
            filename_disk
          }
        }
      }
      date_created
      cantidad
      descripcion
      diagnostico {
        code
        descripcion
      }
      ficha_id {
        id
      }
      examenes {
        id
        examenes_id {
          id
          estado
          orden
          nombre
          codigo
          cantidad
          categoria
        }
        cantidad
        descripcion
      }
      recetas {
        id
        Recetas_id {
          id
          estado
          nombre
          diagnostico
          receta
          orden
        }
        formula
      }
    }
  }
`

export const ANULLED_MEDICAL_COMPLEMENT = gql`
  mutation UpdateMedicalComplement($id: ID!) {
    update_complementos_medicos_item(id: $id, data: { estado: "annulled" }) {
      id
      estado
      orden
      date_updated
      tipo
      user_created {
        id
        first_name
        last_name
        profesional {
          nombre
          identificacion
          especialidad
          cargo
          no_registro_medico
          firma {
            id
            filename_disk
          }
        }
      }
      date_created
      cantidad
      descripcion
      diagnostico {
        code
        descripcion
      }
      ficha_id {
        id
      }
      examenes {
        id
        examenes_id {
          id
          estado
          orden
          nombre
          codigo
          cantidad
          categoria
        }
        cantidad
        descripcion
      }
      recetas {
        id
        Recetas_id {
          id
          estado
          nombre
          diagnostico
          receta
          orden
        }
        formula
      }
    }
  }
`

export const BUDGET_CREATE = gql`
  mutation ($budgetData: create_presupuesto_input!) {
    create_presupuesto_item(data: $budgetData) {
      id
      estado
      date_created
      user_created {
        first_name
        last_name
      }
    }
  }
`

export const BUDGET_CREATE_RELATIONS = gql`
  mutation (
    $dataServices: [create_presupuesto_salas_servicios_input!]
    $dataProducts: [create_presupuesto_productos_input!]
    $dataTherapies: [create_presupuesto_terapias_salas_servicios_input!]
  ) {
    create_presupuesto_salas_servicios_items(data: $dataServices) {
      id
    }
    create_presupuesto_productos_items(data: $dataProducts) {
      id
    }
    create_presupuesto_terapias_salas_servicios_items(data: $dataTherapies) {
      id
    }
  }
`

export const BUDGET_EDIT = gql`
  mutation ($budgetId: ID!, $budgetData: update_presupuesto_input!) {
    update_presupuesto_item(id: $budgetId, data: $budgetData) {
      id
      date_updated
    }
  }
`

export const BUDGET_DELETE = gql`
  mutation ($budgetId: ID!) {
    delete_presupuesto_item(id: $budgetId) {
      id
    }
  }
`

export const SCHEDULE_DELETE = gql`
  mutation ($scheduleId: ID!) {
    delete_citas_item(id: $scheduleId) {
      id
    }
  }
`

export const CREATE_INVOICE = gql`
  mutation CreateSiigoInvoice($invoiceData: create_facturas_siigo_input!) {
    create_facturas_siigo_item(data: $invoiceData) {
      id
    }
  }
`
