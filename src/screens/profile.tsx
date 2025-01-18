import { Avatar } from "@components/avatar";
import { Button } from "@components/button";
import { Input } from "@components/input";
import { ScreenHeader } from "@components/screen-header";
import { Center, Heading, Text, VStack, useToast } from "@gluestack-ui/themed";
import { ScrollView, TouchableOpacity } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import * as yup from "yup";

import { ToastMessage } from "@components/toast-message";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/use-auth";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "../http/api";
import { AppError } from "@utils/error";
import defaultAvatarUser from '@assets/userPhotoDefault.png'

const profileSchema = yup.object({
  name: yup.string().required("Informe o nome."),
  email: yup
    .string()
    .email("Informe um email válido.")
    .required("Informe um email."),
  old_password: yup.string(),
  password: yup
    .string()
    .min(6, "A senha deve ter pelo menos 6 dígitos.")
    .nullable()
    .transform((value) => (!!value ? value : null)),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => (!!value ? value : null))
    .oneOf([yup.ref("password"), null], "A confirmação de senha não confere.")
    .when("password", {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required("Informe a confirmação da senha")
          .transform((value) => (!!value ? value : null)),
    }),
});

type FormDataProps = yup.InferType<typeof profileSchema>;

export function Profile() {
  const { user, updateUserProfile } = useAuth();

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormDataProps>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  async function handleAvatarSelect() {
    try {
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      const photoURI = photoSelected.assets[0].uri;

      if (photoURI) {
        const photoInfo = (await FileSystem.getInfoAsync(photoURI)) as {
          size: number;
        };

        if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
          return toast.show({
            placement: "top",
            render: ({ id }) => (
              <ToastMessage
                id={id}
                action="error"
                title="Imagem muito grande!"
                description="Essa imagem é muito grande. Escolha uma imagem de até 5MB."
                onClose={() => toast.close(id)}
              />
            ),
          });
        }

        // setAvatar(photoURI);
        const fileExtension = photoSelected.assets[0].uri.split(".").pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`,
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append('avatar', photoFile)

        const response = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        })

        const userUpdated = { ...user }
        userUpdated.avatar = response.data.avatar

        await updateUserProfile(userUpdated)

        toast.show({
          placement: "top",
          render: ({ id }) => (
            <ToastMessage
              id={id}
              title="Foto atualizada!"
              description="Sua foto de perfil foi atualiza com sucesso!"
              onClose={() => toast.close(id)}
            />
          ),
        });

        console.log(photoFile);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put("/users", {
        name: data.name,
        password: data.password,
        old_password: data.old_password,
      });

      await updateUserProfile(userUpdated);

      toast.show({
        placement: "top",
        render: ({ id }) => (
          <ToastMessage
            id={id}
            title="Perfil atualizado!"
            description="Suas informações foram atualizadas com sucesso."
            onClose={() => toast.close(id)}
          />
        ),
      });
    } catch (err) {
      const isAppError = err instanceof AppError;
      const title = isAppError
        ? err.message
        : "Não foi possível atualizar seu perfil. Tente novamente mais tarde!";

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
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <Avatar
            source={user.avatar ? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` } : defaultAvatarUser} 
            alt="Foto de perfil do usuário"
            size="xl"
          />

          <TouchableOpacity onPress={handleAvatarSelect}>
            <Text
              color="$green500"
              fontFamily="$heading"
              fontSize="$md"
              mt="$2"
              mb="$8"
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Center w="$full" gap="$4">
            <Controller
              control={control}
              name="name"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Nome"
                  bg="$gray600"
                  value={value}
                  onChangeText={onChange}
                  errorMessage={errors.name?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="E-mail"
                  bg="$gray600"
                  isReadOnly
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />

            <Heading
              alignSelf="flex-start"
              fontFamily="$heading"
              color="$gray200"
              fontSize="$md"
              mt="$12"
              mb="$2"
            >
              Alterar senha
            </Heading>

            <Center w="$full" gap="$4">
              <Controller
                control={control}
                name="old_password"
                render={({ field: { onChange } }) => (
                  <Input
                    placeholder="Senha antiga"
                    bg="$gray600"
                    secureTextEntry
                    onChangeText={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange } }) => (
                  <Input
                    placeholder="Nova senha"
                    bg="$gray600"
                    secureTextEntry
                    onChangeText={onChange}
                    errorMessage={errors.password?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="confirm_password"
                render={({ field: { onChange } }) => (
                  <Input
                    placeholder="Confirme a nova senha"
                    bg="$gray600"
                    secureTextEntry
                    onChangeText={onChange}
                    errorMessage={errors.confirm_password?.message}
                  />
                )}
              />

              <Button
                title="Atualizar"
                mt={4}
                isLoading={isSubmitting}
                onPress={handleSubmit(handleProfileUpdate)}
              />
            </Center>
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
