'use client'

import { useMutation } from '@apollo/client'
import {
  DateTimeValid,
  DropdownValid,
  InputNumberValid,
  InputTextValid,
  PhoneNumberValid,
} from '@components/atoms'
import { useClientContext, useGlobalContext } from '@contexts'
import { DhiPatient } from '@models'
import {
  PAGE_PATH,
  UPDATE_PATIENT,
  civilStatus,
  directusClientMapper,
  genders,
  idTypes,
  mandatoryClientEditFields,
  parseUrl,
} from '@utils'
import { getCountries } from '@utils/api'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'

const ClientEdit = () => {
  const toast = useRef<Toast>(null)
  const [loading, setLoading] = useState(false)
  const { clientInfo, setClientInfo } = useClientContext()
  const { countries, setCountries } = useGlobalContext()
  const router = useRouter()
  const [updatePatient] = useMutation(UPDATE_PATIENT)

  const indicativoDefault = { name: '', dialling: '', image_url: '' }
  const dataClient: DhiPatient = {
    id: clientInfo?.id,
    tipo_documento: idTypes.find((t) => t.type === clientInfo?.tipo_documento),
    documento: clientInfo?.documento,
    primer_nombre: clientInfo?.primer_nombre || '',
    segundo_nombre: clientInfo?.segundo_nombre || '',
    apellido_paterno: clientInfo?.apellido_paterno || '',
    apellido_materno: clientInfo?.apellido_materno || '',
    genero: genders.find((g) => g.type === clientInfo?.genero),
    fecha_nacimiento: clientInfo?.fecha_nacimiento
      ? moment(clientInfo?.fecha_nacimiento as string).toDate()
      : null,
    correo: clientInfo?.correo || '',
    indicativo:
      countries.find((c) => c.dialling === clientInfo?.indicativo) ||
      indicativoDefault,
    telefono: clientInfo?.telefono || null,
    indicativo_2:
      countries.find((c) => c.dialling === clientInfo?.indicativo_2) ||
      indicativoDefault,
    telefono_2: clientInfo?.telefono_2 || null,
    estado_civil: civilStatus.find((c) => c.type === clientInfo?.estado_civil),
  }

  const handleForm = useForm({ defaultValues: dataClient })
  const { reset, handleSubmit, setValue, getValues } = handleForm

  const showError = (status: string, message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: status,
      detail: message,
      sticky: true,
    })
  }

  const editClient = async (data: DhiPatient) => {
    const client = directusClientMapper(data)
    try {
      await updatePatient({
        variables: {
          id: clientInfo?.id,
          data: client,
        },
      })
    } catch (error: any) {
      showError(error.response.data.status, error.response.data.message)
    }
    setClientInfo({ ...clientInfo, ...client })
    clientInfo &&
      router.push(parseUrl(PAGE_PATH.clientDetail, { id: clientInfo.id }))
  }

  const onSubmit = async (data: DhiPatient) => {
    if (mandatoryClientEditFields.map((f) => data[f]).every(Boolean)) {
      setLoading(true)
      await editClient(data)
      setLoading(false)
    } else reset()
  }

  const fetchCountries = () => {
    const lsC = window.localStorage.getItem('countries')
    if (!lsC) {
      getCountries().then((c) => {
        window.localStorage.setItem('countries', JSON.stringify(c))
        setCountries(c)
      })
    } else setCountries(JSON.parse(lsC))
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  useEffect(() => {
    if (!getValues().documento) {
      setValue('documento', dataClient.documento)
      setValue('tipo_documento', dataClient.tipo_documento)
      setValue('primer_nombre', dataClient.primer_nombre)
      setValue('segundo_nombre', dataClient.segundo_nombre)
      setValue('apellido_paterno', dataClient.apellido_paterno)
      setValue('apellido_materno', dataClient.apellido_materno)
      setValue('genero', dataClient.genero)
      setValue('fecha_nacimiento', dataClient.fecha_nacimiento)
      setValue('correo', dataClient.correo)
      setValue('indicativo', dataClient.indicativo)
      setValue('telefono', dataClient.telefono)
      setValue('indicativo_2', dataClient.indicativo_2)
      setValue('telefono_2', dataClient.telefono_2)
      setValue('estado_civil', dataClient.estado_civil)
    }
  }, [clientInfo])

  // const panelsArr = {
  //   panels: [
  //     {
  //       name: 'Nota enfermería implante capilar',
  //       config: [
  //         {
  //           group: 'Nota Enfermeria-Procedimiento',
  //           fields: [
  //             {
  //               name: 'dia_procedimiento',
  //               label: 'Dia de Procedimiento',
  //               type: 'dropdown',
  //               options: [
  //                 { name: 'dia1', value: 'dia1' },
  //                 { name: 'dia2', value: 'dia2' },
  //               ],
  //             },
  //             {
  //               name: 'implante',
  //               label: 'Implante',
  //               type: 'dropdown',
  //               options: [
  //                 { name: 'c', value: 'capilar' },
  //                 { name: 'b', value: 'barba' },
  //                 { name: 'c', value: 'capilar' },
  //                 { name: 'cj', value: 'ceja' },
  //                 { name: 'mx', value: 'mixto' },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // }

  return (
    <>
      <Toast ref={toast} />
      {/* {panelsArr.panels.map((p: any) => {
        return p.config.map((c: any) => {
          return c.fields.map((f: any) => {
            if (f.type === 'dropdown') {
              return (
                <DropdownValid
                  name={f.name}
                  label={f.label}
                  handleForm={handleForm}
                  list={f.options}
                  required
                />
              )
            }
          })
        })
      })} */}
      <form
        autoComplete='off'
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-2 text-sm'
      >
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col md:flex-row gap-4 px-3 pb-3 pt-5 bg-white rounded-md'>
            <div className='w-full md:!w-[50%]'>
              <DropdownValid
                name='tipo_documento'
                label='Tipo de identificación'
                handleForm={handleForm}
                list={idTypes}
                required
              />
              <InputNumberValid
                name='documento'
                label='Identificación'
                handleForm={handleForm}
                icon='id-card'
                required
              />
              <InputTextValid
                name='primer_nombre'
                label='Primer nombre'
                handleForm={handleForm}
                icon='user'
                required
              />
              <InputTextValid
                name='segundo_nombre'
                label='Segundo nombre'
                handleForm={handleForm}
                icon='user'
              />
              <InputTextValid
                name='apellido_paterno'
                label='Apellido paterno'
                handleForm={handleForm}
                icon='user'
                required
              />
              <InputTextValid
                name='apellido_materno'
                label='Apellido materno'
                handleForm={handleForm}
                icon='user'
              />
            </div>
            <div className='w-full md:!w-[50%]'>
              <DropdownValid
                name='genero'
                label='Género'
                handleForm={handleForm}
                list={genders}
              />
              <DateTimeValid
                name='fecha_nacimiento'
                label='Fecha de nacimiento'
                handleForm={handleForm}
                showTime={false}
              />
              <InputTextValid
                name='correo'
                label='Correo electrónico'
                handleForm={handleForm}
                icon='envelope'
                pattern={/\S+@\S+\.\S+/}
              />
              <PhoneNumberValid
                name='telefono'
                diallingName='indicativo'
                label='Teléfono'
                handleForm={handleForm}
                icon='phone'
                minLength={6}
                required
              />
              <PhoneNumberValid
                name='telefono_2'
                diallingName='indicativo_2'
                label='Teléfono 2'
                handleForm={handleForm}
                icon='phone'
                minLength={6}
              />
              <DropdownValid
                name='estado_civil'
                label='Estado civil'
                handleForm={handleForm}
                list={civilStatus}
              />
            </div>
          </div>
          <div className='flex gap-2 flex-wrap mb-4 justify-end'>
            <Button
              label={'Cancelar'}
              type='button'
              severity='danger'
              rounded
              onClick={() => {
                clientInfo &&
                  router.push(
                    parseUrl(PAGE_PATH.clientDetail, { id: clientInfo.id }),
                  )
              }}
              className='text-sm w-full md:w-auto'
            />
            <Button
              label={'Guardar'}
              type='submit'
              severity='success'
              rounded
              className='text-sm w-full md:w-auto'
              loading={loading}
            />
          </div>
        </div>
      </form>
    </>
  )
}

export default ClientEdit
