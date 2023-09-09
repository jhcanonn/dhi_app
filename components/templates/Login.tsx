'use client'

import { useMutation } from '@apollo/client'
import { Cookies, withCookies } from 'react-cookie'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DHI_SESSION, GET_TOKEN, PAGE_PATH, expiresCookie } from '@utils'
import { directusSystemClient } from './Providers'
import { LoginData } from '@models'
import { InputTextValid } from '@components/atoms'
import { Button } from 'primereact/button'
import PasswordValid from '@components/atoms/PasswordValid'
import { Avatar } from 'primereact/avatar'
import { Message } from 'primereact/message'
import Link from 'next/link'
import { Tooltip } from 'primereact/tooltip'
import { refreshToken } from '@utils/api'

const Login = ({ cookies }: { cookies: Cookies }) => {
  const router = useRouter()

  const [login, { data, loading, error }] = useMutation(GET_TOKEN, {
    client: directusSystemClient,
  })

  const handleForm = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const { reset, handleSubmit } = handleForm

  const onSubmit = async (data: LoginData) => {
    if (Object.keys(data).every(Boolean)) {
      await login({
        variables: {
          email: data.email,
          password: data.password,
        },
      })
    } else reset()
  }

  const handleForgotPassword = () => {
    console.log('Olvido su contraseña')
  }

  const verifyCookie = async () => {
    const access_token = await refreshToken(cookies)
    access_token && router.push(PAGE_PATH.calendar)
  }

  useEffect(() => {
    if (cookies?.get(DHI_SESSION)) {
      verifyCookie()
    } else {
      if (data) {
        cookies.set(DHI_SESSION, data.auth_login, {
          path: '/',
          expires: expiresCookie(),
        })
        router.push(PAGE_PATH.calendar)
      }
    }
  }, [data])

  return (
    <section className='flex justify-center self-center !min-w-[90%] sm:!min-w-[33rem]'>
      <div className='p-1 bg-gradient-to-b from-brand via-transparent to-transparent rounded-[4rem] w-full'>
        <form
          autoComplete='off'
          onSubmit={handleSubmit(onSubmit)}
          className='bg-white rounded-[4rem] px-5 sm:!px-20 py-16 w-full flex flex-col justify-evenly items-center min-h-[30rem] gap-2'
        >
          <div className='flex flex-col gap-2 justify-center items-center grow mb-6 mt-3'>
            <Avatar
              image={`${process.env.NEXT_PUBLIC_DIRECTUS_BASE_URL}/assets/e7935d20-6ff6-45e6-98e7-e7380dfcf9c7`}
              label='DHI'
              shape='square'
              size='xlarge'
              className='bg-brand text-white text-2xl font-extrabold w-7 rounded-full mb-2'
            />
            <h2 className='text-2xl font-bold'>¡Bienvenido a DHI!</h2>
            <h4 className='text-md font-thin'>Inicie sesión para continuar</h4>
          </div>
          <InputTextValid
            name='email'
            label='Correo electrónico'
            handleForm={handleForm}
            icon='envelope'
            required
            pattern={/\S+@\S+\.\S+/}
          />
          <PasswordValid
            name='password'
            label='Contraseña'
            handleForm={handleForm}
            icon='lock'
            required
          />
          <Tooltip target='.forgot-password' />
          <Link
            href={'#'}
            onClick={handleForgotPassword}
            className='forgot-password text-sm self-end text-brand font-medium'
            data-pr-tooltip='No disponible aun.'
            data-pr-position='left'
          >
            Olvidó contraseña?
          </Link>
          <Button
            label='Iniciar sesión'
            type='submit'
            severity='success'
            rounded
            className='w-full !bg-brand !border-brand !rounded-md font-bold py-[0.7rem] mt-2'
          />
          <div className='h-4 mt-2 w-full text-center'>
            {loading && (
              <i className='pi pi-spin pi-spinner text-brand text-3xl'></i>
            )}
            {error && (
              <Message
                severity='error'
                text={error.message}
                className='!text-invalid [&_svg]:!text-invalid w-full text-xs [&_.p-inline-message-text]:text-sm'
              />
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

export default withCookies(Login)
