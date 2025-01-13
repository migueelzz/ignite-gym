import { VStack, Image, Center, Text, Heading, ScrollView, useToast } from '@gluestack-ui/themed'

import BackgroundImg from '@assets/background.png'
import Logo from '@assets/logo.svg'
import { Input } from '@components/input'
import { Button } from '@components/button'

import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@hooks/use-auth'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { AppError } from '@utils/error'
import { ToastMessage } from '@components/toast-message'

const signInSchema = yup.object({
  email: yup.string().email('Informe um e-mail válido.').required('Informe o e-mail.'),
  password: yup.string().required('Informe a senha.').min(6, 'A senha deve ter pelo menos 6 dígitos.'),
})

type FormData = yup.InferType<typeof signInSchema>

export function SignIn() {
  const { signIn } = useAuth()

  const toast = useToast()

  const navigation = useNavigation<AuthNavigatorRoutesProps>()

  const { control, handleSubmit, formState: { isSubmitting, errors } } = useForm<FormData>({
    resolver: yupResolver(signInSchema)
  })

  function handleNewAccount() {
    navigation.navigate("signUp")
  }

  async function handleSignIn({ email, password }: FormData) {
    try {
      await signIn(email, password)

    } catch (err) {
      const isAppError = err instanceof AppError

      const title = isAppError ? err.message : 'Não foi possível entrar. Tente novamente mais tarde!'

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            action="error"
            title={title}
            onClose={() => toast.close(id)}
          />
        ),
      });
    }
  }

  return (
    <ScrollView 
      contentContainerStyle={{ flexGrow: 1 }} 
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1}>
        <Image
          w="$full"
          h={624}
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt="Pessoas treinando"
          position='absolute'
        />

        <VStack flex={1} px="$10" pb="$16">
          <Center my="$24">
            <Logo />

            <Text color="$gray100" fontSize="$sm">
              Treine sua mente e o seu corpo.
            </Text>
          </Center>

          <Center gap="$2">
            <Heading color="$gray100">Acesse a conta</Heading>

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  errorMessage={errors.email?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  errorMessage={errors.password?.message}
                />
              )}
            />

            <Button 
              title="Acessar" 
              onPress={handleSubmit(handleSignIn)}
              isLoading={isSubmitting}
            />
          </Center>

          <Center flex={1} justifyContent='flex-end' mt="$4">
            <Text color="$gray100" fontSize="$sm" mb="$3" fontFamily='$body'>AInda não tem acesso?</Text>

            <Button 
              title="Criar sua conta" 
              variant="outline" 
              onPress={handleNewAccount}
            />
          </Center>
        </VStack>
      </VStack>
    </ScrollView>
  )
}