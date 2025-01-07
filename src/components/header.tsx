import { Heading, HStack, Text, VStack, Icon } from "@gluestack-ui/themed";
import { Avatar } from "./avatar";
import { LogOut } from "lucide-react-native";

export function Header() {
  return (
    <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap="$4">
      <Avatar 
        source={{ uri: "https://github.com/migueelzz.png" }} 
        w="$16"
        h="$16"
        alt="Foto de perfil do usuário"
      />
      <VStack flex={1}>
        <Text color="$gray100" fontSize="$sm">Olá,</Text>
        <Heading color="$gray100" fontSize="$md">Miguel Lemes</Heading>
      </VStack>

      <Icon as={LogOut} color="$gray200" size="xl" />
    </HStack>
  )
}