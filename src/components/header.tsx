import { Heading, HStack, Text, VStack, Icon } from "@gluestack-ui/themed";

import { Avatar } from "./avatar";
import { LogOut } from "lucide-react-native";
import defaultAvatarUser from '@assets/userPhotoDefault.png'

import { useAuth } from "@hooks/use-auth";
import { TouchableOpacity } from "react-native";

export function Header() {
  const { user, signOut } = useAuth()

  return (
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
      <Avatar 
        source={user.avatar ? { uri: user.avatar } : defaultAvatarUser} 
        w="$16"
        h="$16"
        alt="Foto de perfil do usuário"
      />
      <VStack flex={1}>
        <Text color="$gray100" fontSize="$sm">Olá,</Text>
        <Heading color="$gray100" fontSize="$md">
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={signOut}>
        <Icon 
          as={LogOut} 
          color="$gray200" 
          size="xl" 
        />
      </TouchableOpacity>

    </HStack>
  )
}