import { Avatar } from "@components/avatar";
import { Button } from "@components/button";
import { Input } from "@components/input";
import { ScreenHeader } from "@components/screen-header";
import { Center, Heading, Text, VStack, useToast } from "@gluestack-ui/themed";
import { Alert, ScrollView, TouchableOpacity } from "react-native";

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

import { useState } from "react";
import { ToastMessage } from "@components/toast-message";

export function Profile() {
  const [avatar, setAvatar] = useState("https://github.com/migueelzz.png");

  const toast = useToast();

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

        setAvatar(photoURI);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
        <Center mt="$6" px="$10">
          <Avatar
            source={{ uri: avatar }}
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
            <Input placeholder="Nome" bg="$gray600" />
            <Input
              value="miguellemes005@gmail.com"
              placeholder="E-mail"
              bg="$gray600"
              isReadOnly
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
              <Input placeholder="Senha antiga" bg="$gray600" secureTextEntry />

              <Input placeholder="Nova senha" bg="$gray600" secureTextEntry />
              <Input
                placeholder="Confirme a nova senha"
                bg="$gray600"
                secureTextEntry
              />

              <Button title="Atualizar" />
            </Center>
          </Center>
        </Center>
      </ScrollView>
    </VStack>
  );
}
