'use client'

import { useMutation } from '@apollo/client'
import {
  DateTimeValid,
  DropdownValid,
  InputNumberValid,
  InputTextValid,
  PhoneNumberValid,
} from '@components/atoms'
import { PatientDataExtra } from '@components/molecules'
import { useClientContext, useGlobalContext } from '@contexts'
import { DhiPatient } from '@models'
import {
  LocalStorageTags,
  PAGE_PATH,
  UPDATE_PATIENT,
  civilStatus,
  convertValuesToDateIfSo,
  directusClientMapper,
  idTypes,
  parseUrl,
  regexPatterns,
} from '@utils'
import { getCountries } from '@utils/api'
import { goToPage } from '@utils/go-to'
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

  const dataClient: DhiPatient = {
    id: clientInfo?.id,
    tipo_documento: idTypes.find((t) => t.type === clientInfo?.tipo_documento),
    documento: clientInfo?.documento,
    primer_nombre: clientInfo?.primer_nombre || '',
    segundo_nombre: clientInfo?.segundo_nombre || '',
    apellido_paterno: clientInfo?.apellido_paterno || '',
    apellido_materno: clientInfo?.apellido_materno || '',
    fecha_nacimiento: clientInfo?.fecha_nacimiento
      ? moment(clientInfo?.fecha_nacimiento as string).toDate()
      : null,
    correo: clientInfo?.correo || '',
    indicativo: undefined,
    telefono: clientInfo?.telefono || null,
    indicativo_2: undefined,
    telefono_2: clientInfo?.telefono_2 || null,
    estado_civil: civilStatus.find((c) => c.type === clientInfo?.estado_civil),
    datos_extra: clientInfo?.datos_extra
      ? convertValuesToDateIfSo(clientInfo.datos_extra)
      : undefined,
  }

  const handleForm = useForm<DhiPatient>({ defaultValues: dataClient })
  const {
    handleSubmit: handleSubmitMain,
    setValue: setValueMain,
    getValues: getValuesMain,
  } = handleForm

  const handleFormExtra = useForm({ defaultValues: dataClient.datos_extra })
  const {
    handleSubmit: handleSubmitExtra,
    setValue: setValueExtra,
    getValues: getValuesExtra,
  } = handleFormExtra

  const showError = (status: string, message: string) => {
    toast.current?.show({
      severity: 'error',
      summary: status,
      detail: message,
      sticky: true,
    })
  }

  const editPatient = async () => {
    const client = directusClientMapper(getValuesMain())
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
    setLoading(false)
    clientInfo &&
      goToPage(parseUrl(PAGE_PATH.clientDetail, { id: clientInfo.id }), router)
  }

  const onSubmit = async () => {
    await handleSubmitExtra(async (dataExtra: any) => {
      await handleSubmitMain(async () => {
        setLoading(true)
        setValueMain('datos_extra', dataExtra)
        await editPatient()
      })()
    })()
  }

  const fetchCountries = () => {
    const lsC = window.localStorage.getItem(LocalStorageTags.COUNTRIES)
    if (!lsC) {
      getCountries().then((c) => {
        window.localStorage.setItem(
          LocalStorageTags.COUNTRIES,
          JSON.stringify(c),
        )
        setCountries(c)
      })
    } else setCountries(JSON.parse(lsC))
  }

  const options = { shouldValidate: true }

  const initDataMain = () => {
    if (!getValuesMain().documento)
      for (const key in dataClient)
        setValueMain(key as 'stringify', dataClient[key], options)
  }

  const initDataExtra = () => {
    const dataExtra = getValuesExtra() as any
    if (!dataExtra.identidad_de_genero) {
      const datosExtra: any = dataClient.datos_extra
      for (const key in datosExtra)
        setValueExtra(key as 'stringify', datosExtra[key], options)
    }
  }

  useEffect(() => {
    if (clientInfo && countries.length) {
      setValueMain(
        'indicativo',
        countries.find((c) => c.dialling === clientInfo.indicativo),
        options,
      )
      setValueMain(
        'indicativo_2',
        countries.find((c) => c.dialling === clientInfo.indicativo_2),
        options,
      )
    }
  }, [countries])

  useEffect(() => {
    initDataMain()
    initDataExtra()
  }, [clientInfo])

  useEffect(() => {
    fetchCountries()
  }, [])

  return (
    <>
      <Toast ref={toast} />
      <section className='flex flex-col gap-4 text-sm'>
        <section className='flex flex-col gap-y-1 bg-white rounded-md px-3 pb-3 pt-4'>
          <form id='form_patient_main' autoComplete='off'>
            <div className='!grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-1'>
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
                min={0}
              />
              <InputTextValid
                name='primer_nombre'
                label='Primer nombre'
                handleForm={handleForm}
                icon='user'
                required
                pattern={regexPatterns.onlyEmpty}
              />
              <InputTextValid
                name='segundo_nombre'
                label='Segundo nombre'
                handleForm={handleForm}
                icon='user'
                pattern={regexPatterns.onlyEmpty}
              />
              <InputTextValid
                name='apellido_paterno'
                label='Apellido paterno'
                handleForm={handleForm}
                icon='user'
                required
                pattern={regexPatterns.onlyEmpty}
              />
              <InputTextValid
                name='apellido_materno'
                label='Apellido materno'
                handleForm={handleForm}
                icon='user'
                pattern={regexPatterns.onlyEmpty}
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
                pattern={regexPatterns.email}
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
          </form>
          <PatientDataExtra id='extra' handleForm={handleFormExtra} />
        </section>
        <div className='flex gap-2 flex-wrap mb-4 justify-end'>
          <Button
            label={'Cancelar'}
            type='button'
            severity='danger'
            rounded
            onClick={() => {
              clientInfo &&
                goToPage(
                  parseUrl(PAGE_PATH.clientDetail, { id: clientInfo.id }),
                  router,
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
            onClick={onSubmit}
            form='form_patient_extra'
          />
        </div>
      </section>
    </>
  )
}

export default ClientEdit
